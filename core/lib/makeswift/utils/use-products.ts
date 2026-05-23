'use client';

import { useLocale } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import {
  BcProductSchema,
  useBcProductToVibesProduct,
} from './use-bc-product-to-vibes-product/use-bc-product-to-vibes-product';

import type { Product } from '@/vibes/soul/primitives/product-card';

const ProductListSchema = z.object({
  products: z.array(BcProductSchema),
});

function useFetch<T>(url: string | null, schema: z.ZodType<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!!url);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json() as Promise<unknown>)
      .then((json) => {
        const parsed = schema.safeParse(json);
        if (parsed.success) setData(parsed.data);
      })
      .catch(() => null)
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, isLoading };
}

interface Props {
  collection: 'none' | 'best-selling' | 'newest' | 'featured';
  collectionLimit?: number;
  additionalProductIds: string[];
}

export function useProducts({ collection, collectionLimit = 20, additionalProductIds }: Props) {
  const bcProductToVibesProduct = useBcProductToVibesProduct();
  const locale = useLocale();

  const collectionUrl =
    collection !== 'none' ? `/api/bc/products?group=${collection}&locale=${locale}` : null;
  const additionalUrl = additionalProductIds.length
    ? `/api/bc/products?ids=${additionalProductIds.join(',')}&locale=${locale}`
    : null;

  const { data: collectionData, isLoading: isCollectionLoading } = useFetch(
    collectionUrl,
    ProductListSchema,
  );
  const { data: additionalData, isLoading: isAdditionalLoading } = useFetch(
    additionalUrl,
    ProductListSchema,
  );

  const isLoading = isCollectionLoading || isAdditionalLoading;

  const products = useMemo<Product[] | null>(() => {
    if (isLoading) return null;
    const combined = [
      ...(collectionData?.products.slice(0, collectionLimit) ?? []),
      ...(additionalData?.products ?? []),
    ];
    return combined.map(bcProductToVibesProduct);
  }, [isLoading, collectionData, additionalData, collectionLimit, bcProductToVibesProduct]);

  return { products, isLoading };
}
