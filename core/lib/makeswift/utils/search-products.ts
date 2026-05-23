'use server';

import { z } from 'zod';

import { BcProductSchema } from './use-bc-product-to-vibes-product/use-bc-product-to-vibes-product';

export async function searchProducts(query: string): Promise<BcProductSchema[]> {
  if (!query) return [];

  try {
    const baseUrl =
      typeof window === 'undefined'
        ? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
        : '';
    const res = await fetch(
      `${baseUrl}/api/bc/products?search=${encodeURIComponent(query)}`,
    );

    if (!res.ok) return [];

    const data: unknown = await res.json();
    const parsed = z.array(BcProductSchema).safeParse(data);

    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}
