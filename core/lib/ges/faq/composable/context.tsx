'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface CategoryInfo {
  slug: string;
  title: string;
  sortOrder: number;
  itemCount: number;
}

interface FaqContextValue {
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
  categories: CategoryInfo[];
  registerCategory: (info: CategoryInfo) => void;
  unregisterCategory: (slug: string) => void;
  showCounts: boolean;
}

const FaqContext = createContext<FaqContextValue | null>(null);

export function useFaqContext(): FaqContextValue | null {
  return useContext(FaqContext);
}

interface ProviderProps {
  children: ReactNode;
  showCounts: boolean;
  initialActiveSlug?: string | null;
}

export function FaqProvider({ children, showCounts, initialActiveSlug = null }: ProviderProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(initialActiveSlug);
  const [categoryMap, setCategoryMap] = useState<Record<string, CategoryInfo>>({});

  useEffect(() => {
    setActiveSlug(initialActiveSlug);
  }, [initialActiveSlug]);

  const registerCategory = useCallback((info: CategoryInfo) => {
    setCategoryMap((prev) => {
      const existing = prev[info.slug];
      if (
        existing &&
        existing.title === info.title &&
        existing.sortOrder === info.sortOrder &&
        existing.itemCount === info.itemCount
      ) {
        return prev;
      }
      return { ...prev, [info.slug]: info };
    });
  }, []);

  const unregisterCategory = useCallback((slug: string) => {
    setCategoryMap((prev) => {
      if (!(slug in prev)) return prev;
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }, []);

  const categories = useMemo(
    () =>
      Object.values(categoryMap).sort(
        (a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title),
      ),
    [categoryMap],
  );

  const value = useMemo<FaqContextValue>(
    () => ({
      activeSlug,
      setActiveSlug,
      categories,
      registerCategory,
      unregisterCategory,
      showCounts,
    }),
    [activeSlug, categories, registerCategory, unregisterCategory, showCounts],
  );

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
}
