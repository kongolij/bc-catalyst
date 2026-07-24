'use client';

import { createContext, useContext } from 'react';

interface FaqSectionContextValue {
  activeSlug: string | null;
  registerSlug: (slug: string) => () => void;
}

export const FaqSectionContext = createContext<FaqSectionContextValue>({
  activeSlug: null,
  registerSlug: () => () => undefined,
});

export function useFaqSectionContext(): FaqSectionContextValue {
  return useContext(FaqSectionContext);
}
