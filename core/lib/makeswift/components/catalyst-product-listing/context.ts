'use client';

import { createContext, type ReactNode } from 'react';

export interface CatalystProductListingContextValue {
  productListing: ReactNode;
}

export const CatalystProductListingContext =
  createContext<CatalystProductListingContextValue | null>(null);
