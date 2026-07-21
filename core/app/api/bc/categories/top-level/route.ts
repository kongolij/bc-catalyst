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
      const featuredRootIds = new Set<number>();

      result.data.site.featuredProducts.edges?.forEach((pe) => {
        pe?.node.categories.edges?.forEach((ce) => {
          const crumbs = ce?.node.breadcrumbs.edges ?? [];
          const rootId = crumbs[0]?.node.entityId;

          if (rootId != null) featuredRootIds.add(rootId);
        });
      });

      filtered = tree.filter((top) => featuredRootIds.has(top.entityId));
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
