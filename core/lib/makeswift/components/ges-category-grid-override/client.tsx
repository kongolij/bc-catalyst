'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { GesCategoryCardClient } from '../ges-category-card/client';

interface TopLevelCategory {
  entityId: number;
  name: string;
  path: string;
  productCount: number;
  image: { url: string; altText: string } | null;
}

type ComboValue = string | { value?: string; id?: string } | undefined;

interface ManualEntry {
  matchId?: ComboValue;
  categoryId?: string;
  titleOverride?: string;
  iconUrl?: string;
  hrefOverride?: string;
}

interface HiddenId {
  id?: ComboValue;
}

interface Props {
  className?: string;
  disableApi?: boolean;
  apiFilter?: 'featured' | 'best-selling' | 'all';
  columns?: '2' | '3' | '4' | '5';
  gap?: string;
  limit?: string;
  manualEntries?: ManualEntry[];
  hiddenIds?: HiddenId[];
  children?: ReactNode;
}

function comboToString(v: ComboValue): string {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    const raw = v.value ?? v.id ?? '';
    return typeof raw === 'string' ? raw.trim() : '';
  }
  return '';
}

interface RenderedCard {
  key: string;
  categoryId: string;
  titleOverride?: string;
  iconUrl?: string;
  hrefOverride?: string;
}

export function GesCategoryGridOverrideClient({
  className,
  disableApi = false,
  apiFilter = 'featured',
  columns = '4',
  gap = '16px',
  limit,
  manualEntries,
  hiddenIds,
  children,
}: Props) {
  const [cats, setCats] = useState<TopLevelCategory[]>([]);

  useEffect(() => {
    if (disableApi) {
      setCats([]);
      return;
    }
    let cancelled = false;
    const overrideFilter =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('catGridFilter')
        : null;
    const effectiveFilter = overrideFilter ?? apiFilter;
    const qs = effectiveFilter && effectiveFilter !== 'all' ? `?filter=${effectiveFilter}` : '';

    fetch(`/api/bc/categories/top-level${qs}`)
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
  }, [apiFilter, disableApi]);

  const cards = useMemo<RenderedCard[]>(() => {
    const hidden = new Set(
      (hiddenIds ?? []).map((h) => comboToString(h.id)).filter(Boolean),
    );
    const overridesById = new Map<string, ManualEntry>();
    const additions: ManualEntry[] = [];

    (manualEntries ?? []).forEach((m) => {
      const key = comboToString(m.matchId);
      if (key) {
        overridesById.set(key, m);
      } else if (m.categoryId?.trim()) {
        additions.push(m);
      }
    });

    const kept: RenderedCard[] = cats
      .filter((c) => !hidden.has(String(c.entityId)))
      .map((c, i) => {
        const id = String(c.entityId);
        const o = overridesById.get(id);
        return {
          key: `api-${id}-${i}`,
          categoryId: id,
          titleOverride: o?.titleOverride?.trim() || undefined,
          iconUrl: o?.iconUrl?.trim() || undefined,
          hrefOverride: o?.hrefOverride?.trim() || undefined,
        };
      });

    const added: RenderedCard[] = additions.map((m, i) => ({
      key: `add-${m.categoryId}-${i}`,
      categoryId: String(m.categoryId),
      titleOverride: m.titleOverride?.trim() || undefined,
      iconUrl: m.iconUrl?.trim() || undefined,
      hrefOverride: m.hrefOverride?.trim() || undefined,
    }));

    const merged = [...kept, ...added];

    // eslint-disable-next-line no-console
    console.debug('[CategoryGridOverride] merge', {
      cats,
      manualEntries,
      hiddenIds,
      overrides: Array.from(overridesById.keys()),
      additionsCount: additions.length,
      merged,
    });

    return merged;
  }, [cats, manualEntries, hiddenIds]);

  const max = Number(limit);
  const visible = Number.isFinite(max) && max > 0 ? cards.slice(0, max) : cards;

  return (
    <div
      className={['ges-cat-grid', className].filter(Boolean).join(' ')}
      data-cols={columns}
      style={{ ['--ges-cat-gap' as string]: gap }}
    >
      {visible.map((c) => (
        <GesCategoryCardClient
          key={c.key}
          categoryId={c.categoryId}
          titleOverride={c.titleOverride}
          iconUrl={c.iconUrl}
          hrefOverride={c.hrefOverride}
        />
      ))}
      {children}
    </div>
  );
}
