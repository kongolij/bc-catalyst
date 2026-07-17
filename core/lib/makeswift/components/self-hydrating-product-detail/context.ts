'use client';

import { createContext } from 'react';

export interface ProductContextValue {
  entityId: string;
}

export const ProductContext = createContext<ProductContextValue | null>(null);
