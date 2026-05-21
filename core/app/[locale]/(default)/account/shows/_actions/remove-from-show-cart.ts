'use server';

import { removeFromShowCart } from '~/lib/show-cart';

export async function removeShowCartItem(id: string): Promise<void> {
  await removeFromShowCart(id);
}
