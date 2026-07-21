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

function collectIds(node: L1 | L2 | L3, out: Set<number>) {
  out.add(node.entityId);
  const kids = (node as L1).children ?? [];

  kids.forEach((c) => collectIds(c, out));
}

function filterTreeByCategoryIds(tree: L1[], allowedIds: Set<number>): L1[] {
  return tree
    .map((top) => {
      const topIds = new Set<number>();

      collectIds(top, topIds);

      const hasFeatured = Array.from(topIds).some((id) => allowedIds.has(id));

      if (!hasFeatured) return null;

      return top;
    })
    .filter((n): n is L1 => n !== null);
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
      const allowedIds = new Set<number>();

      result.data.site.featuredProducts.edges?.forEach((e) => {
        e?.node.categories.edges?.forEach((c) => {
          if (c?.node.entityId) allowedIds.add(c.node.entityId);
        });
      });

      return NextResponse.json({ tree: filterTreeByCategoryIds(tree, allowedIds) });
    }

    return NextResponse.json({ tree });
  } catch (err) {
    console.error('[/api/bc/nav-tree]', err);

    return NextResponse.json({ error: 'Failed to fetch nav tree' }, { status: 500 });
  }
}
