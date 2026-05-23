'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  ProductCard,
  ProductCardSkeleton,
  type Product,
} from '@/vibes/soul/primitives/product-card';
import {
  BcProductSchema,
  useBcProductToVibesProduct,
} from '~/lib/makeswift/utils/use-bc-product-to-vibes-product/use-bc-product-to-vibes-product';

interface Props {
  className?: string;
  entityId?: string;
  aspectRatio: '1:1' | '5:6' | '3:4';
  colorScheme: 'light' | 'dark';
  badge: { show: boolean; text: string };
  showCompare?: boolean;
}

export function MakeswiftProductCard({ className, entityId, badge, ...props }: Props) {
  const bcProductToVibesProduct = useBcProductToVibesProduct();
  const locale = useLocale();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!!entityId);

  useEffect(() => {
    if (!entityId) return;
    setIsLoading(true);
    fetch(`/api/bc/products?entityId=${entityId}&locale=${locale}`)
      .then((r) => r.json() as Promise<unknown>)
      .then((data) => {
        const parsed = BcProductSchema.safeParse(data);
        if (parsed.success) setProduct(bcProductToVibesProduct(parsed.data));
      })
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, [entityId, locale, bcProductToVibesProduct]);

  if (!entityId || isLoading || !product) {
    return <ProductCardSkeleton className={className} />;
  }

  return (
    <ProductCard
      className={className}
      product={{
        ...product,
        badge: badge.show ? badge.text : undefined,
      }}
      {...props}
    />
  );
}
