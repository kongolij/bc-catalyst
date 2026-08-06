'use client';

import { type ReactNode } from 'react';

import {
  CatalystProductListingContext,
  type CatalystProductListingContextValue,
} from './context';

export function CatalystProductListingProvider({
  value,
  children,
}: {
  value: CatalystProductListingContextValue;
  children: ReactNode;
}) {
  return (
    <CatalystProductListingContext.Provider value={value}>
      {children}
    </CatalystProductListingContext.Provider>
  );
}
