import { NextRequest, NextResponse } from 'next/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const ProductDetailQuery = graphql(`
  query BcSelfHydratingProductDetail($entityId: Int!) {
    site {
      product(entityId: $entityId) {
        entityId
        name
        path
        plainTextDescription(characterLimit: 1000)
        description
        defaultImage {
          url(width: 800)
          altText
        }
        prices {
          price {
            value
            currencyCode
          }
          salePrice {
            value
            currencyCode
          }
        }
      }
    }
  }
`);

function formatPrice(price: { value: number; currencyCode: string } | null | undefined) {
  if (!price) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(price.value);
}

export async function GET(req: NextRequest) {
  const entityIdParam = req.nextUrl.searchParams.get('entityId');
  const entityId = entityIdParam ? parseInt(entityIdParam, 10) : NaN;

  if (Number.isNaN(entityId)) {
    return NextResponse.json({ error: 'entityId param is required' }, { status: 400 });
  }

  try {
    const result = await client.fetch({
      document: ProductDetailQuery,
      variables: { entityId },
      fetchOptions: { next: { revalidate } },
    });

    const product = result.data.site.product;

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: product.entityId.toString(),
      name: product.name,
      path: product.path,
      description: product.description,
      plainTextDescription: product.plainTextDescription,
      image: product.defaultImage?.url ?? null,
      imageAlt: product.defaultImage?.altText ?? product.name,
      price: formatPrice(product.prices?.price),
      salePrice: formatPrice(product.prices?.salePrice),
    });
  } catch (err) {
    console.error('[/api/bc/product-detail]', err);

    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
