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
  hiddenIds?: string;
  orderIds?: string;
  children?: ReactNode;
}

function parseIds(csv?: string): number[] {
  if (!csv) return [];

  return csv
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function GesCategoryGridClient({
  className,
  mode = 'api',
  columns = '4',
  gap = '16px',
  limit,
  hiddenIds,
  orderIds,
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

  const hidden = new Set(parseIds(hiddenIds));
  const order = parseIds(orderIds);

  let visible = cats.filter((c) => !hidden.has(c.entityId));

  if (order.length > 0) {
    const byId = new Map(visible.map((c) => [c.entityId, c]));

    visible = order.map((id) => byId.get(id)).filter((c): c is TopLevelCategory => !!c);
  }

  const max = Number(limit);

  if (mode === 'api' && Number.isFinite(max) && max > 0) {
    visible = visible.slice(0, max);
  }

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
