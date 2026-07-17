import { z } from 'zod';

import { BcProductSchema } from './use-bc-product-to-vibes-product/use-bc-product-to-vibes-product';

/**
 * Runs client-side inside the Makeswift editor Combobox.
 * We intentionally do NOT use 'use server' here because Makeswift's Combobox
 * invokes getOptions from its own runtime context and server-action bindings
 * don't reliably reach our origin. A plain browser fetch to /api/bc/products
 * works because the editor iframe is loaded from our app origin.
 */
export async function searchProducts(query: string): Promise<BcProductSchema[]> {
  // eslint-disable-next-line no-console
  console.log('[searchProducts] called', { query });

  if (!query) return [];

  const isBrowser = typeof window !== 'undefined';
  const origin = isBrowser
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const url = `${origin}/api/bc/products?search=${encodeURIComponent(query)}`;

  try {
    // eslint-disable-next-line no-console
    console.log('[searchProducts] fetching', { url });

    const res = await fetch(url, { credentials: 'include' });

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
