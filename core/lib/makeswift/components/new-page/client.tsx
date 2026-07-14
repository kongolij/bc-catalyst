'use client';

import { type ReactNode } from 'react';

import { Stream } from '@/vibes/soul/lib/streamable';
import { ProductCard, ProductCardSkeleton } from '@/vibes/soul/primitives/product-card';
import { ProductCarousel } from '@/vibes/soul/sections/product-carousel';

import { useNewPageData } from './data-context';

interface Props {
  header?: ReactNode;
  middle?: ReactNode;
  footer?: ReactNode;
}

export function MakeswiftNewPage({ header, middle, footer }: Props) {
  const { id, featuredProduct, relatedProducts } = useNewPageData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {header}

      <section aria-labelledby="new-page-featured" className="my-8">
        <h2 id="new-page-featured" className="sr-only">
          Featured product (id: {id})
        </h2>
        <div className="mx-auto max-w-sm">
          <Stream fallback={<ProductCardSkeleton />} value={featuredProduct}>
            {(product) =>
              product ? <ProductCard aspectRatio="5:6" product={product} showCompare /> : null
            }
          </Stream>
        </div>
      </section>

      {middle}

      <section aria-labelledby="new-page-related" className="my-8">
        <h2 id="new-page-related" className="mb-4 text-2xl font-semibold">
          You may also like
        </h2>
        <ProductCarousel products={relatedProducts} showButtons showScrollbar />
      </section>

      {footer}
    </div>
  );
}
