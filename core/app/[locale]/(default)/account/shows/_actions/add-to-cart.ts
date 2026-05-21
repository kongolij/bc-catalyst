'use server';

import { z } from 'zod';

import { addToShowCart } from '~/lib/show-cart';

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
    return { status: 'error', message: 'Invalid product data.' };
  }

  const { productId, variantId, showPrice, showId, name, sku, imageUrl } = result.data;

  try {
    await addToShowCart({
      productId,
      variantId,
      showId,
      showPrice,
      name,
      sku,
      imageUrl,
      quantity: 1,
    });

    return { status: 'success', message: 'Added to show cart!' };
  } catch (error) {
    console.error('[show add-to-cart] error:', error);

    return { status: 'error', message: 'Failed to add to show cart.' };
  }
}
