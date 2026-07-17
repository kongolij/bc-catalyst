'use server';

import { z } from 'zod';

import { BcProductSchema } from './use-bc-product-to-vibes-product/use-bc-product-to-vibes-product';

export async function searchProducts(query: string): Promise<BcProductSchema[]> {
  const isBrowser = typeof window !== 'undefined';

  // eslint-disable-next-line no-console
  console.log('[searchProducts] called', { query, isBrowser });

  if (!query) return [];

  try {
    const baseUrl = isBrowser
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const url = `${baseUrl}/api/bc/products?search=${encodeURIComponent(query)}`;

    // eslint-disable-next-line no-console
    console.log('[searchProducts] fetching', { url });

    const res = await fetch(url);

    // eslint-disable-next-line no-console
    console.log('[searchProducts] response', { status: res.status, ok: res.ok });

    if (!res.ok) return [];

    const data: unknown = await res.json();
    const parsed = z.array(BcProductSchema).safeParse(data);

    // eslint-disable-next-line no-console
    console.log('[searchProducts] parsed', {
      success: parsed.success,
      count: parsed.success ? parsed.data.length : 0,
      error: parsed.success ? null : parsed.error.issues.slice(0, 3),
    });

    return parsed.success ? parsed.data : [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[searchProducts] threw', err);
    return [];
  }
}
