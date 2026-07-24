'use client';

import { createContext, useContext } from 'react';

interface FaqSectionContextValue {
  activeSlug: string | null;
}

export const FaqSectionContext = createContext<FaqSectionContextValue>({ activeSlug: null });

export function useFaqSectionContext(): FaqSectionContextValue {
  return useContext(FaqSectionContext);
}
