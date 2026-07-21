import { NextRequest, NextResponse } from 'next/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

export const dynamic = 'force-dynamic';

const NavTreeQuery = graphql(`
  query BcNavTree($featuredFirst: Int) {
    site {
      categoryTree {
        entityId
        name
        path
        children {
          entityId
          name
          path
          children {
            entityId
            name
            path
          }
        }
      }
      featuredProducts(first: $featuredFirst) {
        edges {
          node {
            entityId
            categories {
              edges {
                node {
                  entityId
                  breadcrumbs(depth: 10) {
                    edges {
                      node {
                        entityId
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);

interface L3 {
  entityId: number;
  name: string;
  path: string;
}
interface L2 extends L3 {
  children?: L3[];
}
interface L1 extends L3 {
  children?: L2[];
}

// A category is "on a featured path" if it or any of its ancestors is where a
// featured product is directly assigned. We collect every entityId along each
// product's breadcrumb chain, so the whole path (root → leaf) is included.
function pruneToFeaturedIds(tree: L1[], featuredPathIds: Set<number>): L1[] {
  return tree
    .filter((l1) => featuredPathIds.has(l1.entityId))
    .map((l1) => ({
      ...l1,
      children: (l1.children ?? [])
        .filter((l2) => featuredPathIds.has(l2.entityId))
        .map((l2) => ({
          ...l2,
          children: (l2.children ?? []).filter((l3) => featuredPathIds.has(l3.entityId)),
        })),
    }));
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter');
  const featuredLimit = Number(url.searchParams.get('featuredFirst') ?? 50);

  try {
    const result = await client.fetch({
      document: NavTreeQuery,
      variables: { featuredFirst: featuredLimit },
      fetchOptions: { next: { revalidate } },
    });

    const tree = (result.data.site.categoryTree ?? []) as L1[];

    if (filter === 'featured') {
      const featuredPathIds = new Set<number>();

      result.data.site.featuredProducts.edges?.forEach((pe) => {
        pe?.node.categories.edges?.forEach((ce) => {
          if (ce?.node.entityId) featuredPathIds.add(ce.node.entityId);
          ce?.node.breadcrumbs.edges?.forEach((be) => {
            if (be?.node.entityId) featuredPathIds.add(be.node.entityId);
          });
        });
      });

      const pruned = pruneToFeaturedIds(tree, featuredPathIds);

      console.log('[/api/bc/nav-tree] filter=featured', {
        featuredProductCount: result.data.site.featuredProducts.edges?.length ?? 0,
        featuredPathIds: Array.from(featuredPathIds),
        topLevelBefore: tree.length,
        topLevelAfter: pruned.length,
      });

      return NextResponse.json({
        tree: pruned,
        _debug: {
          featuredProductCount: result.data.site.featuredProducts.edges?.length ?? 0,
          featuredPathIds: Array.from(featuredPathIds),
          topLevelBefore: tree.length,
          topLevelAfter: pruned.length,
        },
      });
    }

    return NextResponse.json({ tree });
  } catch (err) {
    console.error('[/api/bc/nav-tree]', err);

    return NextResponse.json({ error: 'Failed to fetch nav tree' }, { status: 500 });
  }
}
