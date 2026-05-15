'use server';

import { BigCommerceAPIError, BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { z } from 'zod';

import { addToOrCreateCart } from '~/lib/cart';
import { MissingCartError } from '~/lib/cart/error';

export interface AddToCartState {
  status: 'idle' | 'success' | 'error';
  message?: string;
}

const schema = z.object({
  productId: z.coerce.number(),
  variantId: z.coerce.number().optional(),
});

export async function addShowProductToCart(
  prevState: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  const result = schema.safeParse({
    productId: formData.get('productId'),
    variantId: formData.get('variantId') || undefined,
  });

  if (!result.success) {
    return { status: 'error', message: 'Invalid product data.' };
  }

  const { productId, variantId } = result.data;

  try {
    await addToOrCreateCart({
      lineItems: [
        {
          productEntityId: productId,
          variantEntityId: variantId,
          quantity: 1,
        },
      ],
    });

    return { status: 'success', message: 'Added to cart!' };
  } catch (error) {
    if (error instanceof MissingCartError) {
      return { status: 'error', message: 'Cart not found. Please try again.' };
    }

    if (error instanceof BigCommerceGQLError) {
      return {
        status: 'error',
        message: error.message.includes('variant ID is required')
          ? 'This product requires a variant selection.'
          : 'Failed to add to cart.',
      };
    }

    if (error instanceof BigCommerceAPIError) {
      return { status: 'error', message: 'Failed to add to cart.' };
    }

    return { status: 'error', message: 'Failed to add to cart.' };
  }
}
