'use client';

import { useIsInBuilder } from '@makeswift/runtime/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx } from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Children,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FaqSectionContext } from '../sections/context';

interface ApiCategory {
  id: string;
  title: string;
  count: number;
  sortOrder: number;
  isCustom?: boolean;
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

interface CategoryDisplayOverride {
  matchId?: ComboValue;
  labelOverride?: string;
  sortOverride?: string;
}

interface ItemOverride {
  matchId?: ComboValue;
  questionOverride?: string;
  answerOverride?: string;
}

interface AdditionalItem {
  categoryId?: ComboValue;
  question?: string;
  answer?: string;
}

interface CustomSidebarEntry {
  label?: string;
  slug?: string;
  sortOrder?: string;
}

interface Props {
  className?: string;
  title?: string;
  defaultCategoryId?: ComboValue;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  sidebarTitle?: string;
  clearLabel?: string;
  showCounts?: boolean;
  syncToUrl?: boolean;
  hiddenCategoryIds?: HiddenId[];
  hiddenItemIds?: HiddenId[];
  itemOverrides?: ItemOverride[];
  additionalItems?: AdditionalItem[];
  categoryDisplay?: CategoryDisplayOverride[];
  customSidebarEntries?: CustomSidebarEntry[];
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
  emptyStateTitle = 'Choose a category',
  emptyStateMessage = 'Select a topic from the sidebar to view its frequently asked questions.',
  sidebarTitle = 'Filter FAQs',
  clearLabel = '× Clear Filter',
  showCounts = true,
  hiddenCategoryIds,
  hiddenItemIds,
  itemOverrides,
  additionalItems,
  categoryDisplay,
  customSidebarEntries,
  children,
  activeId,
  setActiveId,
}: ShellProps) {
  const isInBuilder = useIsInBuilder();
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

  const visibleCategories = useMemo<ApiCategory[]>(() => {
    const hidden = new Set(
      (hiddenCategoryIds ?? []).map((h) => comboToString(h.id)).filter(Boolean),
    );
    const overridesById = new Map<string, CategoryDisplayOverride>();
    (categoryDisplay ?? []).forEach((o) => {
      const key = comboToString(o.matchId);
      if (key) overridesById.set(key, o);
    });

    const fromApi = apiCategories
      .filter((c) => !hidden.has(c.id))
      .map((c) => {
        const override = overridesById.get(c.id);
        const labelNext = override?.labelOverride?.trim() ? override.labelOverride : c.title;
        const sortNext = override?.sortOverride?.trim()
          ? Number(override.sortOverride) || c.sortOrder
          : c.sortOrder;
        return { ...c, title: labelNext, sortOrder: sortNext };
      });

    const custom = (customSidebarEntries ?? [])
      .map<ApiCategory | null>((e) => {
        const slug = (e.slug ?? '').trim();
        const label = (e.label ?? '').trim();
        if (!slug || !label) return null;
        const parsed = Number((e.sortOrder ?? '').trim());
        return {
          id: slug,
          title: label,
          count: 0,
          sortOrder: Number.isFinite(parsed) && parsed > 0 ? parsed : 999,
          isCustom: true,
        };
      })
      .filter((c): c is ApiCategory => c !== null);

    return [...fromApi, ...custom].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [apiCategories, hiddenCategoryIds, categoryDisplay, customSidebarEntries]);

  const effectiveItems = useMemo<ApiItem[]>(() => {
    const hidden = new Set(
      (hiddenItemIds ?? []).map((h) => comboToString(h.id)).filter(Boolean),
    );
    const overridesById = new Map<string, ItemOverride>();
    (itemOverrides ?? []).forEach((o) => {
      const key = comboToString(o.matchId);
      if (key) overridesById.set(key, o);
    });

    const merged: ApiItem[] = apiItems
      .filter((i) => !hidden.has(i.id))
      .map((i) => {
        const o = overridesById.get(i.id);
        if (!o) return i;
        const q = o.questionOverride?.trim() ? o.questionOverride : i.question;
        const a = o.answerOverride?.trim() ? o.answerOverride : i.answer;
        return { ...i, question: q, answer: a };
      });

    (additionalItems ?? []).forEach((n, idx) => {
      const catId = comboToString(n.categoryId);
      const q = (n.question ?? '').trim();
      if (!catId || !q) return;
      merged.push({
        id: `custom-${catId}-${idx}`,
        categoryId: catId,
        question: q,
        answer: n.answer ?? '',
      });
    });

    return merged;
  }, [apiItems, hiddenItemIds, itemOverrides, additionalItems]);

  const effectiveCountByCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of effectiveItems) m.set(i.categoryId, (m.get(i.categoryId) ?? 0) + 1);
    return m;
  }, [effectiveItems]);

  const defaultId = comboToString(defaultCategoryId) || null;
  // Blank default => right side stays as a placeholder until the user picks a filter.
  const effectiveId = activeId ?? defaultId;
  const activeCategory = effectiveId
    ? visibleCategories.find((c) => c.id === effectiveId) ?? null
    : null;
  const activeItems = useMemo(
    () =>
      activeCategory ? effectiveItems.filter((i) => i.categoryId === activeCategory.id) : [],
    [effectiveItems, activeCategory],
  );

  const isFiltered = activeId !== null;

  const [claimedSlugs, setClaimedSlugs] = useState<Set<string>>(() => new Set());
  const claimedRef = useRef(claimedSlugs);
  claimedRef.current = claimedSlugs;

  const registerSlug = useCallback((slug: string) => {
    if (!slug) return () => undefined;
    setClaimedSlugs((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
    return () => {
      setClaimedSlugs((prev) => {
        if (!prev.has(slug)) return prev;
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    };
  }, []);

  const contextValue = useMemo(
    () => ({ activeSlug: effectiveId, registerSlug }),
    [effectiveId, registerSlug],
  );

  const shouldRenderApiFallback =
    !!activeCategory && !claimedSlugs.has(activeCategory.id) && !activeCategory.isCustom;

  const apiAccordion = activeCategory ? (
    <>
      <h2 style={styles.sectionTitle}>{activeCategory.title}</h2>
      {activeItems.length === 0 ? (
        <p style={styles.muted}>No FAQs in this category.</p>
      ) : (
        <AccordionPrimitive.Root
          defaultValue={isInBuilder ? activeItems.map((i) => i.id) : undefined}
          type="multiple"
        >
          {activeItems.map((item) => (
            <AccordionPrimitive.Item key={item.id} style={styles.accItem} value={item.id}>
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger style={styles.accTrigger}>
                  <span style={styles.accQuestion}>{item.question}</span>
                  <Chevron />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content style={styles.accContent}>
                <div style={styles.accAnswer}>{item.answer}</div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      )}
    </>
  ) : null;

  const emptyState = (
    <div style={styles.emptyState}>
      <h2 style={styles.emptyTitle}>{emptyStateTitle}</h2>
      <p style={styles.emptyMessage}>{emptyStateMessage}</p>
    </div>
  );

  return (
    <section className={clsx('ges-faq', className)} style={styles.wrap}>
      <h1 style={styles.pageTitle}>{title}</h1>

      <div style={styles.grid}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>{sidebarTitle}</h3>
            {isFiltered ? (
              <button type="button" style={styles.clearBtn} onClick={() => setActiveId(null)}>
                {clearLabel}
              </button>
            ) : null}
          </div>
          <ul style={styles.catList}>
            {!loaded && visibleCategories.length === 0 ? (
              <li style={styles.muted}>Loading…</li>
            ) : null}
            {visibleCategories.map((c) => {
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
                  {showCounts && !c.isCustom ? (
                    <span style={styles.count}>{effectiveCountByCategory.get(c.id) ?? c.count}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </aside>

        <div style={styles.content}>
          {Children.count(children) > 0 ? (
            <FaqSectionContext.Provider value={contextValue}>
              {children}
              {effectiveId ? (shouldRenderApiFallback ? apiAccordion : null) : emptyState}
            </FaqSectionContext.Provider>
          ) : activeCategory ? (
            apiAccordion
          ) : (
            emptyState
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
      width={18}
      height={18}
      style={{ flexShrink: 0, marginTop: 6 }}
      className="[&>line]:origin-center [&>line]:transition [&>line]:duration-300 [&>line]:ease-out"
      stroke="#E06A26"
      strokeWidth={1.8}
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
  sectionTitle: { fontSize: 28, fontWeight: 700, marginBottom: 20, color: '#0a2540' },
  accItem: { borderBottom: '1px solid #e5e7eb' },
  accTrigger: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    padding: '18px 0',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    gap: 24,
    fontSize: 16,
    fontWeight: 600,
    color: '#0a2540',
  },
  accQuestion: { flex: 1 },
  accContent: { overflow: 'hidden' },
  accAnswer: {
    padding: '4px 0 20px',
    color: '#4b5563',
    lineHeight: 1.6,
    fontSize: 15,
    whiteSpace: 'pre-wrap',
  },
  muted: { color: '#888', fontSize: 14 },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    border: '1px dashed #d1d5db',
    borderRadius: 8,
    background: '#f9fafb',
  },
  emptyTitle: { fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#0a2540' },
  emptyMessage: { fontSize: 14, color: '#4b5563', margin: 0, lineHeight: 1.5 },
};
