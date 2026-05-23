'use server';

import { revalidatePath } from 'next/cache';

import { removeFromShowCart } from '~/lib/show-cart';

export async function removeShowCartItem(id: string): Promise<void> {
  await removeFromShowCart(id);
  revalidatePath('/');
}
