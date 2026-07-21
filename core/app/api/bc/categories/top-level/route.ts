import { NextRequest, NextResponse } from 'next/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

export const dynamic = 'force-dynamic';

const TopLevelCategoriesQuery = graphql(`
  query BcTopLevelCategories($featuredFirst: Int) {
    site {
      categoryTree {
        entityId
        name
        path
        description
        productCount
        image {
          url: urlTemplate(lossy: true)
          altText
        }
        children {
          entityId
          children {
            entityId
            children {
              entityId
            }
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

interface DescNode {
  entityId: number;
  children?: DescNode[];
}

function collectIds(node: DescNode, out: Set<number>) {
  out.add(node.entityId);
  (node.children ?? []).forEach((c) => collectIds(c, out));
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter');
  const featuredLimit = Number(url.searchParams.get('featuredFirst') ?? 50);

  try {
    const result = await client.fetch({
      document: TopLevelCategoriesQuery,
      variables: { featuredFirst: featuredLimit },
      fetchOptions: { next: { revalidate } },
    });

    const tree = result.data.site.categoryTree ?? [];

    let filtered = tree;

    if (filter === 'featured') {
      const featuredCatIds = new Set<number>();

      result.data.site.featuredProducts.edges?.forEach((e) => {
        e?.node.categories.edges?.forEach((c) => {
          if (c?.node.entityId) featuredCatIds.add(c.node.entityId);
        });
      });

      filtered = tree.filter((top) => {
        const ids = new Set<number>();

        collectIds(top as DescNode, ids);

        return Array.from(ids).some((id) => featuredCatIds.has(id));
      });
    }

    const categories = filtered.map((c) => ({
      entityId: c.entityId,
      name: c.name,
      path: c.path,
      description: c.description ?? '',
      productCount: c.productCount,
      image: c.image
        ? { url: c.image.url.replace('{:size}', '600x600'), altText: c.image.altText }
        : null,
    }));

    return NextResponse.json({ categories });
  } catch (err) {
    console.error('[/api/bc/categories/top-level]', err);

    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
