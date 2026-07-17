'use client';

import { type ReactNode } from 'react';

import { CatalystProductContext, type CatalystProductContextValue } from './context';

export function CatalystProductProvider({
  value,
  children,
}: {
  value: CatalystProductContextValue;
  children: ReactNode;
}) {
  return (
    <CatalystProductContext.Provider value={value}>{children}</CatalystProductContext.Provider>
  );
}
