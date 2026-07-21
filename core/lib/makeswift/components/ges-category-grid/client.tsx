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

interface CuratedEntry {
  categoryId?: string;
  titleOverride?: string;
  iconUrl?: string;
  hrefOverride?: string;
}

interface Props {
  className?: string;
  mode?: 'api' | 'curated' | 'manual';
  columns?: '2' | '3' | '4' | '5';
  gap?: string;
  limit?: string;
  entries?: CuratedEntry[];
  children?: ReactNode;
}

export function GesCategoryGridClient({
  className,
  mode = 'api',
  columns = '4',
  gap = '16px',
  limit,
  entries,
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

  const gridProps = {
    className: ['ges-cat-grid', className].filter(Boolean).join(' '),
    'data-cols': columns,
    style: { ['--ges-cat-gap' as string]: gap },
  };

  if (mode === 'manual') return <div {...gridProps}>{children}</div>;

  if (mode === 'curated') {
    const rows = (entries ?? []).filter((e) => e.categoryId);

    return (
      <div {...gridProps}>
        {rows.map((e, i) => (
          <GesCategoryCardClient
            key={`${e.categoryId}-${i}`}
            categoryId={e.categoryId}
            titleOverride={e.titleOverride}
            iconUrl={e.iconUrl}
            hrefOverride={e.hrefOverride}
          />
        ))}
      </div>
    );
  }

  const max = Number(limit);
  const visible = Number.isFinite(max) && max > 0 ? cats.slice(0, max) : cats;

  return (
    <div {...gridProps}>
      {visible.map((c) => (
        <GesCategoryCardClient key={c.entityId} categoryId={String(c.entityId)} />
      ))}
    </div>
  );
}
