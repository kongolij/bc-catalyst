'use client';

import { createContext, type PropsWithChildren, useContext } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { type CarouselProduct } from '@/vibes/soul/sections/product-carousel';

interface NewPageData {
  id: string;
  featuredProduct: Streamable<Product | null>;
  relatedProducts: Streamable<CarouselProduct[]>;
}

const NewPageDataContext = createContext<NewPageData | null>(null);

const fallback: NewPageData = {
  id: 'preview',
  featuredProduct: null,
  relatedProducts: [],
};

export function MakeswiftNewPageDataProvider({
  children,
  value,
}: PropsWithChildren<{ value: NewPageData }>) {
  return (
    <NewPageDataContext.Provider value={value}>{children}</NewPageDataContext.Provider>
  );
}

export function useNewPageData(): NewPageData {
  return useContext(NewPageDataContext) ?? fallback;
}
