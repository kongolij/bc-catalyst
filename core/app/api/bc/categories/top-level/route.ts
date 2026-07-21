import { NextResponse } from 'next/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

export const dynamic = 'force-dynamic';

const TopLevelCategoriesQuery = graphql(`
  query BcTopLevelCategories {
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
    }
  }
`);

export async function GET() {
  try {
    const result = await client.fetch({
      document: TopLevelCategoriesQuery,
      fetchOptions: { next: { revalidate } },
    });

    const categories = (result.data.site.categoryTree ?? []).map((c) => ({
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
