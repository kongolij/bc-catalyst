'use server';

import { cookies } from 'next/headers';

const SHOW_CART_COOKIE = 'show-cart';

export interface ShowCartItem {
  id: string;
  productId: number;
  variantId?: number;
  showId: string;
  showPrice: number;
  name: string;
  sku: string;
  imageUrl?: string;
  quantity: number;
}

export async function getShowCart(): Promise<ShowCartItem[]> {
  const cookieJar = await cookies();
  const raw = cookieJar.get(SHOW_CART_COOKIE)?.value;

  if (!raw) return [];

  try {
    return JSON.parse(raw) as ShowCartItem[];
  } catch {
    return [];
  }
}

async function saveShowCart(items: ShowCartItem[]): Promise<void> {
  const cookieJar = await cookies();

  cookieJar.set(SHOW_CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function addToShowCart(
  item: Omit<ShowCartItem, 'id'>,
): Promise<void> {
  const cart = await getShowCart();

  // Same product + variant (any show) → update to current show's price and increment quantity.
  // This ensures switching shows and re-adding reflects the current price list, not the old one.
  const existing = cart.find(
    (i) => i.productId === item.productId && i.variantId === item.variantId,
  );

  if (existing) {
    existing.showId = item.showId;
    existing.showPrice = item.showPrice;
    existing.quantity += item.quantity;
    await saveShowCart(cart);

    return;
  }

  cart.push({ ...item, id: crypto.randomUUID() });
  await saveShowCart(cart);
}

export async function removeFromShowCart(id: string): Promise<void> {
  const cart = await getShowCart();

  await saveShowCart(cart.filter((i) => i.id !== id));
}

export async function clearShowCart(): Promise<void> {
  const cookieJar = await cookies();

  cookieJar.delete(SHOW_CART_COOKIE);
}
