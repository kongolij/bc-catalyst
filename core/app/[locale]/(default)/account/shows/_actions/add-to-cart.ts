'use server';

import { z } from 'zod';

import { addShowItemToCart } from '~/lib/cart/add-show-item-to-cart';

export interface AddToCartState {
  status: 'idle' | 'success' | 'error';
  message?: string;
}

const schema = z.object({
  productId: z.coerce.number(),
  variantId: z.coerce.number().optional(),
  showPrice: z.coerce.number(),
  showId: z.string().min(1),
});

export async function addShowProductToCart(
  prevState: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  const result = schema.safeParse({
    productId: formData.get('productId'),
    variantId: formData.get('variantId') || undefined,
    showPrice: formData.get('showPrice'),
    showId: formData.get('showId'),
  });

  if (!result.success) {
    return { status: 'error', message: 'Invalid product data.' };
  }

  const { productId, variantId, showPrice, showId } = result.data;

  console.log('[show add-to-cart]', { productId, variantId, showPrice, showId });

  try {
    await addShowItemToCart(productId, variantId, showPrice, showId);

    return { status: 'success', message: 'Added to cart!' };
  } catch (error) {
    console.error('[show add-to-cart] error:', error);

    return { status: 'error', message: 'Failed to add to cart.' };
  }
}
