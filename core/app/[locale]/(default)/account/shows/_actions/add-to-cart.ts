'use server';

import { unstable_expireTag } from 'next/cache';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { bcRestPost } from '~/lib/bigcommerce-rest';
import { getCartId, setCartId } from '~/lib/cart';
import { addToShowCart } from '~/lib/show-cart';

const CustomerEntityIdQuery = graphql(`
  query ShowAddToCartCustomerEntityIdQuery {
    customer {
      entityId
    }
  }
`);

interface BCCartResponse {
  data: { id: string };
}

export interface AddToCartState {
  status: 'idle' | 'success' | 'error';
  message?: string;
}

const schema = z.object({
  productId: z.coerce.number(),
  variantId: z.coerce.number().optional(),
  showPrice: z.coerce.number(),
  showId: z.string().min(1),
  name: z.string(),
  sku: z.string(),
  imageUrl: z.string().optional(),
});

export async function addShowProductToCart(
  prevState: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  // Log raw form data first — before any validation so we always see this
  console.log('[show-add-to-cart] formData:', {
    productId: formData.get('productId'),
    variantId: formData.get('variantId'),
    showPrice: formData.get('showPrice'),
    showId: formData.get('showId'),
    name: formData.get('name'),
    sku: formData.get('sku'),
  });

  const result = schema.safeParse({
    productId: formData.get('productId'),
    variantId: formData.get('variantId') || undefined,
    showPrice: formData.get('showPrice'),
    showId: formData.get('showId'),
    name: formData.get('name'),
    sku: formData.get('sku'),
    imageUrl: formData.get('imageUrl') || undefined,
  });

  if (!result.success) {
    console.error('[show-add-to-cart] validation failed:', result.error.flatten());

    return { status: 'error', message: 'Invalid product data.' };
  }

  const { productId, variantId, showPrice, showId, name, sku, imageUrl } = result.data;

  console.log('[show-add-to-cart] validated — productId:', productId, '| variantId:', variantId, '| showPrice:', showPrice, '| showId:', showId);

  try {
    // 1. Write to cookie show cart — preserves showId so the shows page can display
    //    per-show line items with their locked prices.
    await addToShowCart({ productId, variantId, showId, showPrice, name, sku, imageUrl, quantity: 1 });

    // 2. Write to BC native cart via Management REST API with list_price so the
    //    price-list price is locked into the actual BC cart line item.
    //    BC creates a new line item when list_price differs (different show price),
    //    and increments quantity when it matches (same show, same price).
    const lineItem = {
      product_id: productId,
      quantity: 1,
      list_price: showPrice + 1, // TEST: +$1 to check if is_custom_price becomes true
      ...(variantId !== undefined ? { variant_id: variantId } : {}),
    };

    const existingCartId = await getCartId();

    console.log('[show-add-to-cart] lineItem:', JSON.stringify(lineItem));
    console.log('[show-add-to-cart] showId:', showId, '| showPrice:', showPrice, '| existingCartId:', existingCartId ?? 'none');

    if (existingCartId) {
      const payload = { line_items: [lineItem] };

      console.log('[show-add-to-cart] POST /v3/carts/%s/items payload:', existingCartId, JSON.stringify(payload));

      const res = await bcRestPost<BCCartResponse>(`/v3/carts/${existingCartId}/items`, payload);

      console.log('[show-add-to-cart] BC cart response:', JSON.stringify(res));
    } else {
      // No cart yet — create one and associate with the logged-in customer.
      const customerAccessToken = await getSessionCustomerAccessToken();
      let customerId: number | undefined;

      if (customerAccessToken) {
        try {
          const res = await client.fetch({
            document: CustomerEntityIdQuery,
            customerAccessToken,
            fetchOptions: { cache: 'no-store' },
          });

          customerId = res.data.customer?.entityId ?? undefined;
        } catch {
          // proceed without customer_id — cart will still be created
        }
      }

      const channelId = parseInt(process.env.BIGCOMMERCE_CHANNEL_ID ?? '1', 10);
      const createPayload = {
        channel_id: channelId,
        ...(customerId !== undefined ? { customer_id: customerId } : {}),
        line_items: [lineItem],
      };

      console.log('[show-add-to-cart] POST /v3/carts payload:', JSON.stringify(createPayload));

      const newCart = await bcRestPost<BCCartResponse>('/v3/carts', createPayload);

      console.log('[show-add-to-cart] BC cart created:', JSON.stringify(newCart));

      await setCartId(newCart.data.id);
    }

    unstable_expireTag(TAGS.cart);
    revalidatePath('/');

    return { status: 'success', message: 'Added to cart!' };
  } catch (error) {
    console.error('[show add-to-cart] error:', error);

    return { status: 'error', message: 'Failed to add to cart.' };
  }
}
