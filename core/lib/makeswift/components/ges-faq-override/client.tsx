'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx } from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

interface ApiCategory {
  id: string;
  title: string;
  count: number;
  sortOrder: number;
}

interface ApiItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
}

type ComboValue = string | { value?: string; id?: string } | undefined;

interface HiddenId {
  id?: ComboValue;
}

interface CategoryOverride {
  matchId?: ComboValue;
  titleOverride?: string;
  sortOrder?: string;
}

interface ItemOverride {
  matchId?: ComboValue;
  categoryIdOverride?: ComboValue;
  questionOverride?: string;
  answerOverride?: string;
}

interface AdditionalItem {
  categoryId?: ComboValue;
  question?: string;
  answer?: string;
}

interface Props {
  className?: string;
  title?: string;
  defaultCategoryId?: ComboValue;
  clearLabel?: string;
  showCounts?: boolean;
  syncToUrl?: boolean;
  showDataDiagnostics?: boolean;
  hiddenCategoryIds?: HiddenId[];
  categoryOverrides?: CategoryOverride[];
  hiddenItemIds?: HiddenId[];
  itemOverrides?: ItemOverride[];
  additionalItems?: AdditionalItem[];
}

type Provenance = 'api' | 'api-with-override' | 'local';

interface MergedCategory extends ApiCategory {
  provenance: Provenance;
  overriddenFields: string[];
}

interface MergedItem extends ApiItem {
  provenance: Provenance;
  overriddenFields: string[];
}

function comboToString(v: ComboValue): string {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    const raw = v.value ?? v.id ?? '';
    return typeof raw === 'string' ? raw.trim() : '';
  }
  return '';
}

function pickString(override?: string, fallback?: string): string {
  return override?.trim() ? override : (fallback ?? '');
}

export function GesFaqOverrideClient(props: Props) {
  return (
    <Suspense fallback={<FaqShell {...props} activeId={null} setActiveId={() => undefined} />}>
      <UrlSyncedFaq {...props} />
    </Suspense>
  );
}

function UrlSyncedFaq(props: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParam = props.syncToUrl === false ? null : searchParams.get('category');
  const [activeId, setActiveIdState] = useState<string | null>(urlParam);

  useEffect(() => {
    if (props.syncToUrl !== false) setActiveIdState(urlParam);
  }, [urlParam, props.syncToUrl]);

  const setActiveId = useCallback(
    (id: string | null) => {
      setActiveIdState(id);
      if (props.syncToUrl === false) return;
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (id) params.set('category', id);
      else params.delete('category');
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    },
    [props.syncToUrl, router, searchParams],
  );

  return <FaqShell {...props} activeId={activeId} setActiveId={setActiveId} />;
}

interface ShellProps extends Props {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

function FaqShell({
  className,
  title = 'Frequently Asked Questions',
  defaultCategoryId,
  clearLabel = '× Clear Filter',
  showCounts = true,
  showDataDiagnostics = false,
  hiddenCategoryIds,
  categoryOverrides,
  hiddenItemIds,
  itemOverrides,
  additionalItems,
  activeId,
  setActiveId,
}: ShellProps) {
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [apiItems, setApiItems] = useState<ApiItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ges/faqs')
      .then((r) => r.json())
      .then((data: { categories: ApiCategory[]; items: ApiItem[] }) => {
        if (cancelled) return;
        setApiCategories(data.categories ?? []);
        setApiItems(data.items ?? []);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const mergedCategories = useMemo<MergedCategory[]>(() => {
    const hidden = new Set(
      (hiddenCategoryIds ?? []).map((h) => comboToString(h.id)).filter(Boolean),
    );
    const overridesById = new Map<string, CategoryOverride>();
    (categoryOverrides ?? []).forEach((o) => {
      const key = comboToString(o.matchId);
      if (key) overridesById.set(key, o);
    });

    return apiCategories
      .filter((c) => !hidden.has(c.id))
      .map<MergedCategory>((c) => {
        const override = overridesById.get(c.id);
        if (!override) return { ...c, provenance: 'api', overriddenFields: [] };
        const overriddenFields: string[] = [];
        const titleNext = pickString(override.titleOverride, c.title);
        if (override.titleOverride?.trim()) overriddenFields.push('title');
        const sortNext = override.sortOrder?.trim()
          ? Number(override.sortOrder) || c.sortOrder
          : c.sortOrder;
        if (override.sortOrder?.trim()) overriddenFields.push('sortOrder');
        return {
          ...c,
          title: titleNext,
          sortOrder: sortNext,
          provenance: 'api-with-override',
          overriddenFields,
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [apiCategories, hiddenCategoryIds, categoryOverrides]);

  const mergedItems = useMemo<MergedItem[]>(() => {
    const hidden = new Set((hiddenItemIds ?? []).map((h) => comboToString(h.id)).filter(Boolean));
    const overridesById = new Map<string, ItemOverride>();
    (itemOverrides ?? []).forEach((o) => {
      const key = comboToString(o.matchId);
      if (key) overridesById.set(key, o);
    });

    const kept: MergedItem[] = apiItems
      .filter((i) => !hidden.has(i.id))
      .map<MergedItem>((i) => {
        const override = overridesById.get(i.id);
        if (!override) return { ...i, provenance: 'api', overriddenFields: [] };
        const overriddenFields: string[] = [];
        const categoryIdNext = comboToString(override.categoryIdOverride) || i.categoryId;
        if (comboToString(override.categoryIdOverride)) overriddenFields.push('categoryId');
        const questionNext = pickString(override.questionOverride, i.question);
        if (override.questionOverride?.trim()) overriddenFields.push('question');
        const answerNext = pickString(override.answerOverride, i.answer);
        if (override.answerOverride?.trim()) overriddenFields.push('answer');
        return {
          ...i,
          categoryId: categoryIdNext,
          question: questionNext,
          answer: answerNext,
          provenance: 'api-with-override',
          overriddenFields,
        };
      });

    const additions: MergedItem[] = (additionalItems ?? [])
      .map((row, index) => {
        const catId = comboToString(row.categoryId);
        const question = (row.question ?? '').trim();
        if (!catId || !question) return null;
        return {
          id: `local-${catId}-${index}`,
          categoryId: catId,
          question,
          answer: row.answer ?? '',
          provenance: 'local' as Provenance,
          overriddenFields: [],
        };
      })
      .filter((x): x is MergedItem => x !== null);

    return [...kept, ...additions];
  }, [apiItems, hiddenItemIds, itemOverrides, additionalItems]);

  const defaultId = comboToString(defaultCategoryId) || mergedCategories[0]?.id || null;
  const effectiveId = activeId ?? defaultId;
  const activeCategory = mergedCategories.find((c) => c.id === effectiveId) ?? mergedCategories[0];
  const activeItems = useMemo(
    () => mergedItems.filter((i) => i.categoryId === activeCategory?.id),
    [mergedItems, activeCategory?.id],
  );

  const isFiltered = activeId !== null && activeId !== defaultId;

  return (
    <section className={clsx('ges-faq', className)} style={styles.wrap}>
      <h1 style={styles.pageTitle}>{title}</h1>

      <div style={styles.grid}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>Filter FAQs</h3>
            {isFiltered ? (
              <button type="button" style={styles.clearBtn} onClick={() => setActiveId(null)}>
                {clearLabel}
              </button>
            ) : null}
          </div>
          <ul style={styles.catList}>
            {!loaded && mergedCategories.length === 0 ? (
              <li style={styles.muted}>Loading…</li>
            ) : null}
            {mergedCategories.map((c) => {
              const checked = effectiveId === c.id;
              return (
                <li key={c.id} style={styles.catRow}>
                  <label style={styles.catLabel}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setActiveId(checked ? null : c.id)}
                    />
                    <span style={styles.catText}>{c.title}</span>
                  </label>
                  {showCounts ? <span style={styles.count}>{c.count}</span> : null}
                </li>
              );
            })}
          </ul>
        </aside>

        <div style={styles.content}>
          {activeCategory ? (
            <>
              <h2 style={styles.sectionTitle}>{activeCategory.title}</h2>
              {activeItems.length === 0 ? (
                <p style={styles.muted}>No FAQs in this category.</p>
              ) : (
                <AccordionPrimitive.Root type="multiple">
                  {activeItems.map((item) => (
                    <AccordionPrimitive.Item
                      key={item.id}
                      value={item.id}
                      style={styles.accItem}
                    >
                      <AccordionPrimitive.Header>
                        <AccordionPrimitive.Trigger style={styles.accTrigger}>
                          <span style={styles.accQuestion}>{item.question}</span>
                          <Chevron />
                        </AccordionPrimitive.Trigger>
                      </AccordionPrimitive.Header>
                      <AccordionPrimitive.Content style={styles.accContent}>
                        <div style={styles.accAnswer}>{item.answer}</div>
                        {showDataDiagnostics ? (
                          <div style={styles.diagnostic}>
                            <span data-provenance={item.provenance}>
                              {item.provenance === 'api'
                                ? 'API'
                                : item.provenance === 'api-with-override'
                                  ? `API + override (${item.overriddenFields.join(', ')})`
                                  : 'Local addition'}
                            </span>
                            <small style={{ marginLeft: 8, color: '#888' }}>id: {item.id}</small>
                          </div>
                        ) : null}
                      </AccordionPrimitive.Content>
                    </AccordionPrimitive.Item>
                  ))}
                </AccordionPrimitive.Root>
              )}
            </>
          ) : (
            <p style={styles.muted}>No categories available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 10 10"
      width={16}
      height={16}
      style={{ flexShrink: 0, marginTop: 4 }}
      className="[&>line]:origin-center [&>line]:transition [&>line]:duration-300 [&>line]:ease-out"
      stroke="#c8d629"
      strokeWidth={1.5}
    >
      <line
        className="group-data-[state=open]:-translate-y-[3px] group-data-[state=open]:-rotate-90"
        strokeLinecap="round"
        x1={2}
        x2={5}
        y1={2}
        y2={5}
      />
      <line
        className="group-data-[state=open]:-translate-y-[3px] group-data-[state=open]:rotate-90"
        strokeLinecap="round"
        x1={8}
        x2={5}
        y1={2}
        y2={5}
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: '24px 0', color: '#0a2540' },
  pageTitle: { fontSize: 24, fontWeight: 600, marginBottom: 16 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(240px, 320px) 1fr',
    gap: 32,
    alignItems: 'start',
  },
  sidebar: { position: 'sticky', top: 16 },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sidebarTitle: { fontSize: 16, fontWeight: 600, margin: 0 },
  clearBtn: {
    background: 'transparent',
    border: 'none',
    color: '#E06A26',
    fontSize: 13,
    cursor: 'pointer',
    padding: 0,
  },
  catList: { listStyle: 'none', margin: 0, padding: 0 },
  catRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderTop: '1px solid #eee',
  },
  catLabel: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 },
  catText: { fontSize: 14 },
  count: { fontSize: 13, color: '#666' },
  content: {},
  sectionTitle: { fontSize: 22, fontWeight: 600, marginBottom: 16 },
  accItem: { borderBottom: '1px solid #e5e5e5' },
  accTrigger: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 0',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    gap: 24,
    fontSize: 15,
    fontWeight: 500,
  },
  accQuestion: { flex: 1 },
  accContent: { overflow: 'hidden' },
  accAnswer: { padding: '0 0 16px', color: '#333', lineHeight: 1.5 },
  diagnostic: {
    fontSize: 11,
    color: '#666',
    background: '#f5f5f5',
    padding: '4px 8px',
    borderRadius: 4,
    marginBottom: 12,
    display: 'inline-block',
  },
  muted: { color: '#888', fontSize: 14 },
};
