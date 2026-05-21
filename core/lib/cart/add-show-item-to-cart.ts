'use server';

import { unstable_expireTag } from 'next/cache';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { bcRestPost } from '~/lib/bigcommerce-rest';

import { getCartId, setCartId } from '.';
import { validateCartId } from './validate-cart';

const CustomerEntityIdQuery = graphql(`
  query AddShowItemCustomerEntityIdQuery {
    customer {
      entityId
    }
  }
`);

interface RestCartLineItem {
  product_id: number;
  variant_id?: number;
  quantity: number;
  list_price: number;
}

interface RestCartResponse {
  data: {
    id: string;
  };
}

export async function addShowItemToCart(
  productId: number,
  variantId: number | undefined,
  listPrice: number,
): Promise<void> {
  const lineItems: RestCartLineItem[] = [
    {
      product_id: productId,
      ...(variantId !== undefined && { variant_id: variantId }),
      quantity: 1,
      list_price: listPrice,
    },
  ];

  const cartId = await getCartId();
  const cart = await validateCartId(cartId);

  if (cart) {
    await bcRestPost<RestCartResponse>(`/v3/carts/${cart.entityId}/items`, {
      line_items: lineItems,
    });
    unstable_expireTag(TAGS.cart);

    return;
  }

  // No existing cart — create one via REST so list_price is respected from the start
  const customerAccessToken = await getSessionCustomerAccessToken();
  let customerId: number | undefined;

  if (customerAccessToken) {
    try {
      const resp = await client.fetch({
        document: CustomerEntityIdQuery,
        customerAccessToken,
        fetchOptions: { cache: 'no-store' },
      });

      customerId = resp.data.customer?.entityId ?? undefined;
    } catch {
      // proceed without customer_id — cart will be anonymous
    }
  }

  const createBody: Record<string, unknown> = { line_items: lineItems };

  if (customerId) {
    createBody.customer_id = customerId;
  }

  const response = await bcRestPost<RestCartResponse>('/v3/carts', createBody);

  await setCartId(response.data.id);
  unstable_expireTag(TAGS.cart);
}
