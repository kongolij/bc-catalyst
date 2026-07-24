'use client';

import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { FaqProvider, useFaqContext } from './context';

interface Props {
  className?: string;
  title?: string;
  sidebarTitle?: string;
  clearLabel?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  showCounts?: boolean;
  children?: ReactNode;
}

export function FaqPage({
  className,
  title = 'Frequently Asked Questions',
  sidebarTitle = 'Filter FAQs',
  clearLabel = '× Clear Filter',
  emptyStateTitle = 'Choose a category',
  emptyStateMessage = 'Select a topic from the sidebar to view its frequently asked questions.',
  showCounts = true,
  children,
}: Props) {
  return (
    <FaqProvider showCounts={showCounts}>
      <Shell
        className={className}
        clearLabel={clearLabel}
        emptyStateMessage={emptyStateMessage}
        emptyStateTitle={emptyStateTitle}
        sidebarTitle={sidebarTitle}
        title={title}
      >
        {children}
      </Shell>
    </FaqProvider>
  );
}

interface ShellProps {
  className?: string;
  title: string;
  sidebarTitle: string;
  clearLabel: string;
  emptyStateTitle: string;
  emptyStateMessage: string;
  children?: ReactNode;
}

function Shell({
  className,
  title,
  sidebarTitle,
  clearLabel,
  emptyStateTitle,
  emptyStateMessage,
  children,
}: ShellProps) {
  const ctx = useFaqContext();
  const activeSlug = ctx?.activeSlug ?? null;
  const categories = ctx?.categories ?? [];
  const showCounts = ctx?.showCounts ?? true;

  const isFiltered = activeSlug !== null;
  const hasChildren = Boolean(children);

  return (
    <section className={clsx('ges-faq-composable', className)} style={styles.wrap}>
      <h1 style={styles.pageTitle}>{title}</h1>

      <div style={styles.grid}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>{sidebarTitle}</h3>
            {isFiltered ? (
              <button
                onClick={() => ctx?.setActiveSlug(null)}
                style={styles.clearBtn}
                type="button"
              >
                {clearLabel}
              </button>
            ) : null}
          </div>
          <ul style={styles.catList}>
            {categories.length === 0 ? (
              <li style={styles.muted}>Add a FAQ Category to get started.</li>
            ) : null}
            {categories.map((c) => {
              const checked = activeSlug === c.slug;
              return (
                <li key={c.slug} style={styles.catRow}>
                  <label style={styles.catLabel}>
                    <input
                      checked={checked}
                      onChange={() => ctx?.setActiveSlug(checked ? null : c.slug)}
                      type="checkbox"
                    />
                    <span style={styles.catText}>{c.title}</span>
                  </label>
                  {showCounts ? <span style={styles.count}>{c.itemCount}</span> : null}
                </li>
              );
            })}
          </ul>
        </aside>

        <div style={styles.content}>
          {/* Categories always render (for registration); each one hides itself when not active */}
          <div style={{ display: activeSlug ? 'block' : 'none' }}>{children}</div>

          {!activeSlug ? (
            hasChildren ? (
              <div style={styles.emptyState}>
                <h2 style={styles.emptyTitle}>{emptyStateTitle}</h2>
                <p style={styles.emptyMessage}>{emptyStateMessage}</p>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <h2 style={styles.emptyTitle}>Drop FAQ Category blocks here</h2>
                <p style={styles.emptyMessage}>
                  Add one FAQ Category per sidebar entry, then drop FAQ Item blocks inside each.
                </p>
              </div>
            )
          ) : null}
        </div>
      </div>
    </section>
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
