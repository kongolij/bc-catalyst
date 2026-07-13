'use client';

import { createContext, type PropsWithChildren, useContext } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { type CarouselProduct } from '@/vibes/soul/sections/product-carousel';

interface HomePageData {
  featuredProducts: Streamable<Product[]>;
  newestProducts: Streamable<CarouselProduct[]>;
}

const HomePageDataContext = createContext<HomePageData | null>(null);
const fallbackHomePageData: HomePageData = {
  featuredProducts: [],
  newestProducts: [],
};

export function MakeswiftHomePageDataProvider({
  children,
  value,
}: PropsWithChildren<{ value: HomePageData }>) {
  return <HomePageDataContext.Provider value={value}>{children}</HomePageDataContext.Provider>;
}

export function useMakeswiftHomePageData() {
  const data = useContext(HomePageDataContext);

  return data ?? fallbackHomePageData;
}
