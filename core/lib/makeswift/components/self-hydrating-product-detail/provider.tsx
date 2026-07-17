'use client';

import { ReactNode } from 'react';

import { ProductContext, ProductContextValue } from './context';

interface Props {
  entityId: string;
  children: ReactNode;
}

export function ProductContextProvider({ entityId, children }: Props) {
  const value: ProductContextValue = { entityId };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
