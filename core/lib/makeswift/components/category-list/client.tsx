'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface CategoryItem {
  title?: string;
  entityId?: string;
}

interface BcCategory {
  name: string;
  path: string;
  entityId: number;
  image?: { url: string; altText: string } | null;
}

interface Props {
  className?: string;
  additionalCategories?: CategoryItem[];
}

function CategoryCard({ name, path, image }: BcCategory) {
  return (
    <Link
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
      href={path}
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {image ? (
          <Image
            alt={image.altText || name}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            src={image.url}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg fill="none" height={48} stroke="currentColor" viewBox="0 0 24 24" width={48}>
              <path
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 20M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium transition-colors group-hover:text-[#E06A26]">{name}</h3>
      </div>
    </Link>
  );
}

export function MSCategoryList({ className, additionalCategories = [] }: Props) {
  const locale = useLocale();
  const [categories, setCategories] = useState<BcCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const entityIds = additionalCategories
    .map((c) => c.entityId)
    .filter((id): id is string => Boolean(id));

  useEffect(() => {
    if (entityIds.length === 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`/api/bc/categories?ids=${entityIds.join(',')}&locale=${locale}`)
      .then((r) => r.json() as Promise<{ categories?: BcCategory[] }>)
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => null)
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityIds.join(','), locale]);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="grid animate-pulse grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: Math.max(entityIds.length, 4) }).map((_, i) => (
            <div className="h-48 rounded-lg bg-gray-200" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0 && additionalCategories.length > 0) {
    return (
      <div className={className}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {additionalCategories.map((cat, i) => (
            <div
              className="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400"
              key={i}
            >
              {cat.title || `Category ${cat.entityId}`}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.entityId} {...cat} />
        ))}
      </div>
    </div>
  );
}
