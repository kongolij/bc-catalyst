'use client';

import { Children, ReactNode, useEffect, useMemo } from 'react';

import { useFaqContext } from './context';

interface Props {
  slug?: string;
  title?: string;
  sortOrder?: string;
  children?: ReactNode;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function FaqCategory({
  slug: slugProp,
  title = 'New Category',
  sortOrder = '100',
  children,
}: Props) {
  const ctx = useFaqContext();
  const slug = useMemo(() => (slugProp?.trim() ? slugify(slugProp) : slugify(title)), [
    slugProp,
    title,
  ]);
  const itemCount = Children.count(children);
  const parsedSort = Number(sortOrder);
  const finalSort = Number.isFinite(parsedSort) ? parsedSort : 100;

  useEffect(() => {
    if (!ctx || !slug) return;
    ctx.registerCategory({ slug, title, sortOrder: finalSort, itemCount });
    return () => ctx.unregisterCategory(slug);
  }, [ctx, slug, title, finalSort, itemCount]);

  // Outside the page context: render as a standalone section so it isn't invisible on the canvas.
  if (!ctx) {
    return (
      <section style={standaloneStyles.wrap}>
        <div style={standaloneStyles.notice}>
          FAQ Category — drop this inside a FAQ Page block.
        </div>
        <h2 style={standaloneStyles.title}>{title}</h2>
        <div>{children}</div>
      </section>
    );
  }

  const isActive = ctx.activeSlug === slug;

  return (
    <div style={{ display: isActive ? 'block' : 'none' }}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {itemCount === 0 ? (
        <p style={styles.muted}>No FAQ items in this category yet. Drop FAQ Item blocks here.</p>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sectionTitle: { fontSize: 22, fontWeight: 600, marginBottom: 16, color: '#0a2540' },
  muted: { color: '#888', fontSize: 14 },
};

const standaloneStyles: Record<string, React.CSSProperties> = {
  wrap: {
    padding: 16,
    border: '1px dashed #d1d5db',
    borderRadius: 8,
    background: '#fafafa',
    marginBottom: 16,
  },
  notice: { fontSize: 12, color: '#9ca3af', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#0a2540' },
};
