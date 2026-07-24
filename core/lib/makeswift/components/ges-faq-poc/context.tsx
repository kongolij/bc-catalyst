'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface RegisteredFaqSection {
  slug: string;
  title: string;
}

interface FaqContextValue {
  sections: RegisteredFaqSection[];
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
  registerSection: (section: RegisteredFaqSection) => void;
  unregisterSection: (slug: string) => void;
  defaultCategorySlug?: string;
}

const FaqContext = createContext<FaqContextValue | null>(null);

export function useFaqContext(): FaqContextValue | null {
  return useContext(FaqContext);
}

interface FaqProviderProps {
  children: ReactNode;
  defaultCategorySlug?: string;
  initialSlug?: string | null;
  onActiveSlugChange?: (slug: string | null) => void;
}

export function FaqProvider({
  children,
  defaultCategorySlug,
  initialSlug = null,
  onActiveSlugChange,
}: FaqProviderProps) {
  const [sections, setSections] = useState<RegisteredFaqSection[]>([]);
  const [activeSlug, setActiveSlugState] = useState<string | null>(initialSlug);

  const registerSection = useCallback((section: RegisteredFaqSection) => {
    setSections((prev) => {
      const without = prev.filter((s) => s.slug !== section.slug);
      return [...without, section];
    });
  }, []);

  const unregisterSection = useCallback((slug: string) => {
    setSections((prev) => prev.filter((s) => s.slug !== slug));
  }, []);

  const setActiveSlug = useCallback(
    (slug: string | null) => {
      setActiveSlugState(slug);
      onActiveSlugChange?.(slug);
    },
    [onActiveSlugChange],
  );

  useEffect(() => {
    if (initialSlug !== undefined && initialSlug !== null) {
      setActiveSlugState(initialSlug);
    }
  }, [initialSlug]);

  const value = useMemo<FaqContextValue>(
    () => ({
      sections,
      activeSlug,
      setActiveSlug,
      registerSection,
      unregisterSection,
      defaultCategorySlug,
    }),
    [
      sections,
      activeSlug,
      setActiveSlug,
      registerSection,
      unregisterSection,
      defaultCategorySlug,
    ],
  );

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
}
