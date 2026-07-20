import { NextRequest, NextResponse } from 'next/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const GetCategoryEntityIdQuery = graphql(`
  query BcProductsGetCategoryEntityId($path: String!) {
    site {
      route(path: $path) {
        node {
          __typename
          ... on Category {
            entityId
          }
        }
      }
    }
  }
`);

const GetProductsByCategoryQuery = graphql(`
  query BcProductsGetByCategory($categoryEntityId: Int!, $first: Int) {
    site {
      search {
        searchProducts(filters: { categoryEntityId: $categoryEntityId }) {
          products(first: $first) {
            edges {
              node {
                entityId
                name
                path
                defaultImage {
                  url(width: 500)
                  altText
                }
                prices {
                  price { value currencyCode }
                  salePrice { value currencyCode }
                }
              }
            }
          }
        }
      }
    }
  }
`);

const GetProductsByEntityIdsQuery = graphql(`
  query BcProductsGetByEntityIds($entityIds: [Int!]!, $first: Int) {
    site {
      products(entityIds: $entityIds, first: $first) {
        edges {
          node {
            entityId
            name
            path
            defaultImage {
              url(width: 500)
              altText
            }
            prices {
              price { value currencyCode }
              salePrice { value currencyCode }
            }
          }
        }
      }
    }
  }
`);

const GetProductsByGroupQuery = graphql(`
  query BcProductsGetByGroup($first: Int) {
    site {
      featuredProducts(first: $first) {
        edges {
          node {
            entityId
            name
            path
            defaultImage { url(width: 500) altText }
            brand { name path }
            prices {
              price { value currencyCode }
              basePrice { value currencyCode }
              retailPrice { value currencyCode }
              salePrice { value currencyCode }
              priceRange {
                min { value currencyCode }
                max { value currencyCode }
              }
            }
          }
        }
      }
      newestProducts(first: $first) {
        edges {
          node {
            entityId
            name
            path
            defaultImage { url(width: 500) altText }
            brand { name path }
            prices {
              price { value currencyCode }
              basePrice { value currencyCode }
              retailPrice { value currencyCode }
              salePrice { value currencyCode }
              priceRange {
                min { value currencyCode }
                max { value currencyCode }
              }
            }
          }
        }
      }
      bestSellingProducts(first: $first) {
        edges {
          node {
            entityId
            name
            path
            defaultImage { url(width: 500) altText }
            brand { name path }
            prices {
              price { value currencyCode }
              basePrice { value currencyCode }
              retailPrice { value currencyCode }
              salePrice { value currencyCode }
              priceRange {
                min { value currencyCode }
                max { value currencyCode }
              }
            }
          }
        }
      }
    }
  }
`);

const SearchProductsQuery = graphql(`
  query BcProductsSearch($searchTerm: String!, $first: Int) {
    site {
      search {
        searchProducts(filters: { searchTerm: $searchTerm }) {
          products(first: $first) {
            edges {
              node {
                entityId
                name
                path
                defaultImage {
                  url(width: 500)
                  altText
                }
                brand {
                  name
                  path
                }
                prices {
                  price { value currencyCode }
                  basePrice { value currencyCode }
                  retailPrice { value currencyCode }
                  salePrice { value currencyCode }
                  priceRange {
                    min { value currencyCode }
                    max { value currencyCode }
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

function formatPrice(price: { value: number; currencyCode: string } | null | undefined) {
  if (!price) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: price.currencyCode }).format(
    price.value,
  );
}

function normalizeProduct(p: {
  entityId: number;
  name: string;
  path: string;
  defaultImage: { url: string; altText: string } | null | undefined;
  prices: {
    price: { value: number; currencyCode: string } | null;
    salePrice: { value: number; currencyCode: string } | null;
  } | null;
}) {
  return {
    id: p.entityId.toString(),
    name: p.name,
    path: p.path,
    image: p.defaultImage?.url ?? null,
    imageAlt: p.defaultImage?.altText ?? p.name,
    price: formatPrice(p.prices?.price),
    salePrice: formatPrice(p.prices?.salePrice),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const categoryPath = searchParams.get('categoryPath');
  const entityIds = searchParams.get('entityIds');
  const search = searchParams.get('search');
  const group = searchParams.get('group');

  try {
    if (group && ['newest', 'featured', 'best-selling'].includes(group)) {
      const first = Math.min(
        Math.max(parseInt(searchParams.get('limit') ?? '12', 10) || 12, 1),
        50,
      );

      const result = await client.fetch({
        document: GetProductsByGroupQuery,
        variables: { first },
        fetchOptions: { next: { revalidate } },
      });

      const site = result.data.site;
      const edges =
        group === 'newest'
          ? site.newestProducts.edges
          : group === 'featured'
            ? site.featuredProducts.edges
            : site.bestSellingProducts.edges;

      const products = (edges ?? []).map((e) => e.node);

      return NextResponse.json({ products });
    }

    if (search) {
      console.log('[/api/bc/products] search request', { searchTerm: search });

      const result = await client.fetch({
        document: SearchProductsQuery,
        variables: { searchTerm: search, first: 20 },
        fetchOptions: { next: { revalidate } },
      });

      const edges = result.data.site.search.searchProducts.products.edges ?? [];
      const products = edges.map((e) => e.node);

      console.log('[/api/bc/products] search result', {
        searchTerm: search,
        count: products.length,
        firstProduct: products[0] ?? null,
        rawEdgesLength: edges.length,
      });

      return NextResponse.json(products);
    }

    if (categoryPath) {
      const routeResult = await client.fetch({
        document: GetCategoryEntityIdQuery,
        variables: { path: categoryPath },
        fetchOptions: { next: { revalidate } },
      });

      const node = routeResult.data.site.route?.node;

      if (!node || node.__typename !== 'Category') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      const result = await client.fetch({
        document: GetProductsByCategoryQuery,
        variables: { categoryEntityId: node.entityId, first: 12 },
        fetchOptions: { next: { revalidate } },
      });

      const products =
        result.data.site.search.searchProducts.products.edges?.map((e) =>
          normalizeProduct(e.node),
        ) ?? [];

      return NextResponse.json(products);
    }

    if (entityIds) {
      const ids = entityIds
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));

      if (ids.length === 0) return NextResponse.json([]);

      const result = await client.fetch({
        document: GetProductsByEntityIdsQuery,
        variables: { entityIds: ids, first: ids.length },
        fetchOptions: { next: { revalidate } },
      });

      const products =
        result.data.site.products.edges?.map((e) => normalizeProduct(e.node)) ?? [];

      return NextResponse.json(products);
    }

    return NextResponse.json({ error: 'Provide categoryPath or entityIds param' }, { status: 400 });
  } catch (err) {
    console.error('[/api/bc/products]', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
