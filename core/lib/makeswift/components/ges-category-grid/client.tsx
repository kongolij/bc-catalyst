'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { GesCategoryCardClient } from '../ges-category-card/client';

interface TopLevelCategory {
  entityId: number;
  name: string;
  path: string;
  productCount: number;
  image: { url: string; altText: string } | null;
}

interface Props {
  className?: string;
  mode?: 'api' | 'manual';
  columns?: '2' | '3' | '4' | '5';
  gap?: string;
  limit?: string;
  children?: ReactNode;
}

export function GesCategoryGridClient({
  className,
  mode = 'api',
  columns = '4',
  gap = '16px',
  limit,
  children,
}: Props) {
  const [cats, setCats] = useState<TopLevelCategory[]>([]);

  useEffect(() => {
    if (mode !== 'api') return;
    let cancelled = false;
    fetch('/api/bc/categories/top-level')
      .then((r) => r.json())
      .then((data: { categories: TopLevelCategory[] }) => {
        if (!cancelled) setCats(data.categories ?? []);
      })
      .catch(() => {
        if (!cancelled) setCats([]);
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const max = Number(limit);
  const visible =
    mode === 'api' && Number.isFinite(max) && max > 0 ? cats.slice(0, max) : cats;

  return (
    <div
      className={['ges-cat-grid', className].filter(Boolean).join(' ')}
      data-cols={columns}
      style={{ ['--ges-cat-gap' as string]: gap }}
    >
      {mode === 'api'
        ? visible.map((c) => (
            <GesCategoryCardClient key={c.entityId} categoryId={String(c.entityId)} />
          ))
        : children}
    </div>
  );
}
