import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { ProductCardFragment } from '~/components/product-card/fragment';

const NewPageDataQuery = graphql(
  `
    query NewPageDataQuery($entityId: Int!) {
      site {
        product(entityId: $entityId) {
          ...ProductCardFragment
          relatedProducts(first: 12) {
            edges {
              node {
                ...ProductCardFragment
              }
            }
          }
        }
      }
    }
  `,
  [ProductCardFragment],
);

export const getNewPageData = cache(async (entityId: number, customerAccessToken?: string) => {
  try {
    const { data } = await client.fetch({
      document: NewPageDataQuery,
      variables: { entityId },
      customerAccessToken,
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
    });

    return data.site.product;
  } catch {
    return null;
  }
});
