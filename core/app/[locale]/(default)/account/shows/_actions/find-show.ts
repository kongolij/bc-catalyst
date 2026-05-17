'use server';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { z } from 'zod';

import { getSessionCustomerAccessToken, updateSession } from '~/auth';
import { generateCustomerLoginApiJwt } from '~/auth/customer-login-api';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { clearCartId } from '~/lib/cart';
import { bcRestGet, bcRestPut } from '~/lib/bigcommerce-rest';

const CustomerEntityIdQuery = graphql(`
  query ShowsCustomerEntityIdQuery {
    customer {
      entityId
    }
  }
`);

const RefreshTokenMutation = graphql(`
  mutation ShowsRefreshTokenMutation($jwt: String!) {
    loginWithCustomerLoginJwt(jwt: $jwt) {
      customerAccessToken {
        value
      }
    }
  }
`);

const ShowProductsQuery = graphql(`
  query ShowProductsQuery($entityIds: [Int!], $first: Int) {
    site {
      products(entityIds: $entityIds, first: $first) {
        edges {
          node {
            entityId
            name
            sku
            path
            description
            defaultImage {
              altText
              url: urlTemplate(lossy: true)
            }
          }
        }
      }
    }
  }
`);

export interface ShowProduct {
  entityId: number;
  name: string;
  sku: string;
  path: string;
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
  showPrice?: number;
  isMultiVariant: boolean;
  priceMin?: number;
  priceMax?: number;
}

export interface FindShowState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  groupAssigned?: boolean;
  products?: ShowProduct[];
}

const showIdSchema = z.string().min(1, 'Show ID is required').trim();

interface V2CustomerGroup {
  id: number;
  name: string;
}

interface V3Response<T> {
  data: T[];
}

interface V3PriceList {
  id: number;
  name: string;
}

interface PriceListRecord {
  product_id: number;
  variant_id: number;
  price?: number;
  sale_price?: number;
  currency?: string;
}

export async function findShow(
  prevState: FindShowState,
  formData: FormData,
): Promise<FindShowState> {
  const rawId = formData.get('showId');
  const parsed = showIdSchema.safeParse(rawId);

  if (!parsed.success) {
    return { status: 'error', message: 'Please enter a valid Show ID.' };
  }

  const showId = parsed.data;
  const customerAccessToken = await getSessionCustomerAccessToken();

  if (!customerAccessToken) {
    return { status: 'error', message: 'You must be logged in to use this feature.' };
  }

  // 1. Look up customer group by name
  let customerGroup: V2CustomerGroup | undefined;

  try {
    const groups = await bcRestGet<V2CustomerGroup[]>(
      `/v2/customer_groups?name=show-custemer-group-${encodeURIComponent(showId)}&limit=1`,
    );

    customerGroup = groups[0];
  } catch {
    return { status: 'error', message: `Unable to find show "${showId}". Please check the ID.` };
  }

  if (!customerGroup) {
    return { status: 'error', message: `No show found with ID "${showId}".` };
  }

  // 2. Get customer entity ID
  let entityId: number | undefined;

  try {
    const customerResponse = await client.fetch({
      document: CustomerEntityIdQuery,
      customerAccessToken,
      fetchOptions: { cache: 'no-store' },
    });

    entityId = customerResponse.data.customer?.entityId;
  } catch {
    return { status: 'error', message: 'Unable to identify your account.' };
  }

  if (!entityId) {
    return { status: 'error', message: 'Unable to identify your account.' };
  }

  // 3. Assign customer group via v3 REST API
  let groupAssigned = false;

  try {
    await bcRestPut(`/v3/customers`, [{ id: entityId, customer_group_id: customerGroup.id }]);
    groupAssigned = true;
  } catch {
    // Group assignment failed but we still show products
  }

  // Refresh the customer access token so BC's Storefront API picks up the new group
  // immediately — without this, new carts still get base pricing until the token is re-issued
  if (groupAssigned) {
    try {
      const channelId = parseInt(process.env.BIGCOMMERCE_CHANNEL_ID ?? '1', 10);
      const jwt = await generateCustomerLoginApiJwt(entityId, channelId);
      const refreshResult = await client.fetch({
        document: RefreshTokenMutation,
        variables: { jwt },
        fetchOptions: { cache: 'no-store' },
      });
      const freshCat = refreshResult.data?.loginWithCustomerLoginJwt?.customerAccessToken?.value;

      if (freshCat) {
        await updateSession({ user: { customerAccessToken: freshCat, cartId: null } });
      } else {
        await clearCartId();
      }
    } catch {
      await clearCartId();
    }
  }

  // 4. Fetch price list by name
  let priceList: V3PriceList | undefined;

  try {
    const priceListResponse = await bcRestGet<V3Response<V3PriceList>>(
      `/v3/pricelists?name=show-${encodeURIComponent(showId)}&limit=1`,
    );

    priceList = priceListResponse.data[0];
  } catch {
    return {
      status: 'success',
      groupAssigned,
      message: groupAssigned
        ? `Assigned to show "${showId}" but no price list was found.`
        : `Show "${showId}" found but group assignment and price list lookup failed.`,
      products: [],
    };
  }

  if (!priceList) {
    return {
      status: 'success',
      groupAssigned,
      message: `Assigned to show "${showId}" but no price list was found.`,
      products: [],
    };
  }

  // 5. Fetch price list records
  let records: PriceListRecord[] = [];

  try {
    const recordsResponse = await bcRestGet<V3Response<PriceListRecord>>(
      `/v3/pricelists/${priceList.id}/records?limit=250`,
    );

    records = recordsResponse.data;
  } catch {
    return {
      status: 'success',
      groupAssigned,
      message: `Assigned to show "${showId}" but products could not be loaded.`,
      products: [],
    };
  }

  // 6. Group all variant records by product_id
  const productRecordsMap = new Map<number, PriceListRecord[]>();

  for (const record of records) {
    if (record.product_id) {
      const existing = productRecordsMap.get(record.product_id) ?? [];
      productRecordsMap.set(record.product_id, [...existing, record]);
    }
  }

  const productIds = Array.from(productRecordsMap.keys());

  if (productIds.length === 0) {
    return {
      status: 'success',
      groupAssigned,
      message: `Assigned to show "${showId}" but no products are in the price list.`,
      products: [],
    };
  }

  // 7. Fetch product details via GraphQL
  let products: ShowProduct[] = [];

  try {
    const productsResponse = await client.fetch({
      document: ShowProductsQuery,
      variables: { entityIds: productIds, first: productIds.length },
      customerAccessToken,
      fetchOptions: { cache: 'no-store' },
    });

    products = removeEdgesAndNodes(productsResponse.data.site.products).map((product) => {
      const productRecords = productRecordsMap.get(product.entityId) ?? [];
      const prices = productRecords
        .map((r) => r.price ?? r.sale_price)
        .filter((p): p is number => p !== undefined);

      const priceMin = prices.length > 0 ? Math.min(...prices) : undefined;
      const priceMax = prices.length > 0 ? Math.max(...prices) : undefined;
      const isMultiVariant = productRecords.length > 1;

      return {
        entityId: product.entityId,
        name: product.name,
        sku: product.sku,
        path: product.path,
        imageUrl: product.defaultImage?.url,
        imageAlt: product.defaultImage?.altText,
        description: product.description || undefined,
        showPrice: priceMin,
        isMultiVariant,
        priceMin,
        priceMax,
      };
    });
  } catch {
    return {
      status: 'success',
      groupAssigned,
      message: `Assigned to show "${showId}" but product details could not be loaded.`,
      products: [],
    };
  }

  return {
    status: 'success',
    groupAssigned,
    message: `You're set up for show "${showId}". ${products.length} product${products.length === 1 ? '' : 's'} available.`,
    products,
  };
}
