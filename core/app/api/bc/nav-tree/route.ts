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
      // Collect the ROOT (top-level) category entityId for every category any
      // featured product is assigned to, via its breadcrumb ancestor chain.
      const featuredRootIds = new Set<number>();

      result.data.site.featuredProducts.edges?.forEach((pe) => {
        pe?.node.categories.edges?.forEach((ce) => {
          const crumbs = ce?.node.breadcrumbs.edges ?? [];
          const rootId = crumbs[0]?.node.entityId;

          if (rootId != null) featuredRootIds.add(rootId);
        });
      });

      const filtered = tree.filter((top) => featuredRootIds.has(top.entityId));

      console.log('[/api/bc/nav-tree] filter=featured', {
        featuredProductCount: result.data.site.featuredProducts.edges?.length ?? 0,
        featuredRootIds: Array.from(featuredRootIds),
        topLevelBefore: tree.length,
        topLevelAfter: filtered.length,
      });

      return NextResponse.json({
        tree: filtered,
        _debug: {
          featuredProductCount: result.data.site.featuredProducts.edges?.length ?? 0,
          featuredRootIds: Array.from(featuredRootIds),
          topLevelBefore: tree.length,
          topLevelAfter: filtered.length,
        },
      });
    }

    return NextResponse.json({ tree });
  } catch (err) {
    console.error('[/api/bc/nav-tree]', err);

    return NextResponse.json({ error: 'Failed to fetch nav tree' }, { status: 500 });
  }
}
