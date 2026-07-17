'use client';

import { createContext, type ReactNode } from 'react';

export interface CatalystProductContextValue {
  entityId: string;
  productDetail: ReactNode;
}

export const CatalystProductContext = createContext<CatalystProductContextValue | null>(null);
