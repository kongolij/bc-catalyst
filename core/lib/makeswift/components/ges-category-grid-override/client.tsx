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
  showDataDiagnostics?: boolean;
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
  provenance: 'api' | 'api-with-override' | 'local';
  overriddenFields: string[];
}

interface DataDiagnostic {
  id: string;
  label?: string;
}

interface MergeResult {
  cards: RenderedCard[];
  excluded: DataDiagnostic[];
  orphanedOverrides: DataDiagnostic[];
  orphanedExclusions: DataDiagnostic[];
}

export function GesCategoryGridOverrideClient({
  className,
  disableApi = false,
  showDataDiagnostics = false,
  apiFilter = 'featured',
  columns = '4',
  gap = '16px',
  limit,
  manualEntries,
  hiddenIds,
  children,
}: Props) {
  const [cats, setCats] = useState<TopLevelCategory[]>([]);
  const [sourceLoaded, setSourceLoaded] = useState(false);

  useEffect(() => {
    if (disableApi) {
      setCats([]);
      setSourceLoaded(true);
      return;
    }
    setSourceLoaded(false);
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
        if (!cancelled) {
          setCats(data.categories ?? []);
          setSourceLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCats([]);
          setSourceLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiFilter, disableApi]);

  const mergeResult = useMemo<MergeResult>(() => {
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
    const sourceById = new Map(cats.map((c) => [String(c.entityId), c]));
    const sourceIds = new Set(sourceById.keys());

    const kept: RenderedCard[] = cats
      .filter((c) => !hidden.has(String(c.entityId)))
      .map((c, i) => {
        const id = String(c.entityId);
        const o = overridesById.get(id);
        const overriddenFields = [
          o?.titleOverride?.trim() ? 'title' : null,
          o?.iconUrl?.trim() ? 'image' : null,
          o?.hrefOverride?.trim() ? 'link' : null,
        ].filter((field): field is string => field !== null);
        return {
          key: `api-${id}-${i}`,
          categoryId: id,
          titleOverride: o?.titleOverride?.trim() || undefined,
          iconUrl: o?.iconUrl?.trim() || undefined,
          hrefOverride: o?.hrefOverride?.trim() || undefined,
          provenance: o ? 'api-with-override' : 'api',
          overriddenFields,
        };
      });

    const added: RenderedCard[] = additions.map((m, i) => ({
      key: `add-${m.categoryId}-${i}`,
      categoryId: String(m.categoryId),
      titleOverride: m.titleOverride?.trim() || undefined,
      iconUrl: m.iconUrl?.trim() || undefined,
      hrefOverride: m.hrefOverride?.trim() || undefined,
      provenance: 'local',
      overriddenFields: [],
    }));

    const excluded = Array.from(hidden)
      .filter((id) => sourceIds.has(id))
      .map((id) => ({ id, label: sourceById.get(id)?.name }));
    const orphanedOverrides = sourceLoaded
      ? Array.from(overridesById.keys())
          .filter((id) => !sourceIds.has(id))
          .map((id) => ({ id }))
      : [];
    const orphanedExclusions = sourceLoaded
      ? Array.from(hidden)
          .filter((id) => !sourceIds.has(id))
          .map((id) => ({ id }))
      : [];

    return {
      cards: [...kept, ...added],
      excluded,
      orphanedOverrides,
      orphanedExclusions,
    };
  }, [cats, manualEntries, hiddenIds, sourceLoaded]);

  const max = Number(limit);
  const visible =
    Number.isFinite(max) && max > 0
      ? mergeResult.cards.slice(0, max)
      : mergeResult.cards;
  const orphanCount =
    mergeResult.orphanedOverrides.length + mergeResult.orphanedExclusions.length;

  return (
    <div
      className={['ges-cat-grid', className].filter(Boolean).join(' ')}
      data-cols={columns}
      style={{ ['--ges-cat-gap' as string]: gap }}
    >
      {visible.map((c) => (
        <div key={c.key} className="ges-data-record">
          {showDataDiagnostics ? (
            <div className="ges-data-record__diagnostics">
              <span data-provenance={c.provenance}>
                {c.provenance === 'api'
                  ? 'API'
                  : c.provenance === 'api-with-override'
                    ? 'API + override'
                    : 'Local'}
              </span>
              {c.overriddenFields.length > 0 ? (
                <small>Customized: {c.overriddenFields.join(', ')}</small>
              ) : null}
            </div>
          ) : null}
          <GesCategoryCardClient
            categoryId={c.categoryId}
            titleOverride={c.titleOverride}
            iconUrl={c.iconUrl}
            hrefOverride={c.hrefOverride}
          />
        </div>
      ))}
      {children}
      {showDataDiagnostics ? (
        <aside className="ges-data-diagnostics">
          <strong>Data diagnostics</strong>
          {!sourceLoaded ? <p>Loading source records…</p> : null}
          {mergeResult.excluded.length > 0 ? (
            <>
              <h4>Excluded API records</h4>
              <ul>
                {mergeResult.excluded.map((item) => (
                  <li key={`excluded-${item.id}`}>
                    {item.label ?? item.id} <span>Excluded</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {orphanCount > 0 ? (
            <>
              <h4>{orphanCount} orphaned customization(s)</h4>
              <ul>
                {mergeResult.orphanedOverrides.map((item) => (
                  <li key={`override-${item.id}`}>
                    Override for {item.id} no longer matches an API record.
                  </li>
                ))}
                {mergeResult.orphanedExclusions.map((item) => (
                  <li key={`exclusion-${item.id}`}>
                    Exclusion for {item.id} no longer matches an API record.
                  </li>
                ))}
              </ul>
              <p>Remove these IDs from the component’s override or hidden lists.</p>
            </>
          ) : null}
          {sourceLoaded && mergeResult.excluded.length === 0 && orphanCount === 0 ? (
            <p>No exclusions or orphaned customizations.</p>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}
