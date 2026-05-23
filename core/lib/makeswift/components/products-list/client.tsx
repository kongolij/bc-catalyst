'use client';

import { ProductList, ProductListSkeleton } from '@/vibes/soul/sections/product-list';

import { useProducts } from '~/lib/makeswift/utils/use-products';

interface MSProductsListProps {
  className: string;
  collection: 'none' | 'best-selling' | 'newest' | 'featured';
  limit: number;
  additionalProducts: Array<{ entityId?: string }>;
  aspectRatio: '1:1' | '5:6' | '3:4';
  colorScheme: 'light' | 'dark';
}

export function MSProductsList({
  className,
  collection,
  limit,
  additionalProducts,
  ...props
}: MSProductsListProps) {
  const additionalProductIds = additionalProducts.map(({ entityId }) => entityId ?? '');
  const { products, isLoading } = useProducts({
    collection,
    collectionLimit: limit,
    additionalProductIds,
  });

  if (isLoading || products == null || products.length === 0) {
    return <ProductListSkeleton className={className} />;
  }

  return <ProductList {...props} className={className} products={products} />;
}
