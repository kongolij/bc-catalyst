'use client';

import { useFaqContext } from './context';

interface Props {
  className?: string;
  title?: string;
  clearLabel?: string;
  emptyMessage?: string;
}

export function GesFaqFilterClient({
  className,
  title = 'Filter FAQs',
  clearLabel = '× Clear filter',
  emptyMessage = 'Drop FAQ sections on the page — they will appear here automatically.',
}: Props) {
  const ctx = useFaqContext();

  if (!ctx) {
    return (
      <div style={{ padding: 12, border: '1px dashed #d0d0d0', color: '#666' }}>
        FAQ Filter must be placed inside an FAQ Page.
      </div>
    );
  }

  const { sections, activeSlug, setActiveSlug, defaultCategorySlug } = ctx;
  const canClear =
    activeSlug !== null && activeSlug !== '' && activeSlug !== defaultCategorySlug;

  return (
    <div className={['ges-faq-poc__filter', className].filter(Boolean).join(' ')}>
      {title ? <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>{title}</h3> : null}

      {sections.length === 0 ? (
        <p style={{ color: '#888', fontSize: 13 }}>{emptyMessage}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sections.map((s) => {
            const checked = activeSlug === s.slug;
            return (
              <li key={s.slug}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setActiveSlug(checked ? null : s.slug)}
                  />
                  <span>{s.title}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {canClear ? (
        <button
          type="button"
          onClick={() => setActiveSlug(defaultCategorySlug ?? null)}
          style={{
            marginTop: 12,
            padding: '6px 10px',
            border: '1px solid #d0d0d0',
            background: 'transparent',
            borderRadius: 999,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}
