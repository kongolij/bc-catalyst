'use server';

import { unstable_expireTag } from 'next/cache';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { bcRestGet, bcRestPost } from '~/lib/bigcommerce-rest';

import { getCartId, setCartId } from '.';
import { validateCartId } from './validate-cart';

const CustomerEntityIdQuery = graphql(`
  query AddShowItemCustomerEntityIdQuery {
    customer {
      entityId
    }
  }
`);

interface RestModifier {
  id: number;
  display_name: string;
}

interface RestModifierListResponse {
  data: RestModifier[];
}

interface RestModifierCreateResponse {
  data: RestModifier;
}

interface RestCartResponse {
  data: { id: string };
}

const SHOW_REF_MODIFIER_NAME = 'show-ref';

// Returns the modifier's option_id, creating it on the product if it doesn't exist yet.
async function getOrCreateShowModifier(productId: number): Promise<number> {
  const existing = await bcRestGet<RestModifierListResponse>(
    `/v3/catalog/products/${productId}/modifiers`,
  );
  const found = existing.data.find((m) => m.display_name === SHOW_REF_MODIFIER_NAME);

  if (found) return found.id;

  const created = await bcRestPost<RestModifierCreateResponse>(
    `/v3/catalog/products/${productId}/modifiers`,
    {
      type: 'text',
      required: false,
      display_name: SHOW_REF_MODIFIER_NAME,
      config: { default_value: '' },
    },
  );

  return created.data.id;
}

export async function addShowItemToCart(
  productId: number,
  variantId: number | undefined,
  listPrice: number,
  showId: string,
): Promise<void> {
  const modifierOptionId = await getOrCreateShowModifier(productId);

  const lineItems = [
    {
      product_id: productId,
      ...(variantId !== undefined && { variant_id: variantId }),
      quantity: 1,
      list_price: listPrice,
      option_selections: [{ option_id: modifierOptionId, option_value: showId }],
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
