'use client';

import { ProductCarousel, ProductsCarouselSkeleton } from '@/vibes/soul/sections/product-carousel';

import { useProducts } from '~/lib/makeswift/utils/use-products';

interface MSProductsCarouselProps {
  className: string;
  collection: 'none' | 'best-selling' | 'newest' | 'featured';
  limit: number;
  additionalProducts: Array<{ entityId?: string }>;
  aspectRatio: '1:1' | '5:6' | '3:4';
  colorScheme: 'light' | 'dark';
  showScrollbar: boolean;
  showButtons: boolean;
  hideOverflow: boolean;
}

export function MSProductsCarousel({
  className,
  collection,
  limit,
  additionalProducts,
  hideOverflow,
  ...props
}: MSProductsCarouselProps) {
  const additionalProductIds = additionalProducts.map(({ entityId }) => entityId ?? '');
  const { products, isLoading } = useProducts({
    collection,
    collectionLimit: limit,
    additionalProductIds,
  });

  if (isLoading || products == null || products.length === 0) {
    return <ProductsCarouselSkeleton className={className} hideOverflow={hideOverflow} />;
  }

  return (
    <ProductCarousel
      {...props}
      className={className}
      hideOverflow={hideOverflow}
      products={products}
    />
  );
}
