'use client';

import { useIsInBuilder } from '@makeswift/runtime/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { useId } from 'react';

import { useFaqSectionContext } from './context';

interface Item {
  question?: string;
  answer?: string;
}

interface Props {
  title?: string;
  categorySlug?: string;
  items?: Item[];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function FaqSectionEmpty({ title = 'New FAQ', categorySlug, items = [] }: Props) {
  const { activeSlug } = useFaqSectionContext();
  const isInBuilder = useIsInBuilder();
  const slug = (categorySlug?.trim() || slugify(title) || 'new-faq').toLowerCase();

  const filterActive = activeSlug !== null;

  // Live: if user has picked any filter and it doesn't match this section's slug, hide.
  if (!isInBuilder && filterActive && activeSlug !== slug) return null;

  const editorBadge = isInBuilder && filterActive && activeSlug !== slug;

  return (
    <section style={styles.wrap}>
      {editorBadge ? (
        <div style={styles.editorBadge}>
          Editor preview — visible on the live site when the sidebar filter matches “{slug}”
        </div>
      ) : null}
      <h2 style={styles.title}>{title}</h2>
      {items.length === 0 ? (
        <p style={styles.muted}>
          Empty — add rows in the props panel to create your custom FAQ section.
        </p>
      ) : (
        <AccordionPrimitive.Root type="multiple">
          {items.map((it, idx) => (
            <AccordionRow answer={it.answer ?? ''} key={idx} question={it.question ?? ''} />
          ))}
        </AccordionPrimitive.Root>
      )}
    </section>
  );
}

function AccordionRow({ question, answer }: { question: string; answer: string }) {
  const value = useId();
  return (
    <AccordionPrimitive.Item style={styles.item} value={value}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger style={styles.trigger}>
          <span style={styles.q}>{question || 'Untitled question'}</span>
          <Chevron />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content style={styles.content}>
        <div style={styles.a}>{answer}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function Chevron() {
  return (
    <svg
      className="[&>line]:origin-center [&>line]:transition [&>line]:duration-300 [&>line]:ease-out"
      height={16}
      stroke="#c8d629"
      strokeWidth={1.5}
      style={{ flexShrink: 0, marginTop: 4 }}
      viewBox="0 0 10 10"
      width={16}
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
  wrap: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 600, marginBottom: 16, color: '#0a2540' },
  item: { borderBottom: '1px solid #e5e5e5' },
  trigger: {
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
  q: { flex: 1 },
  content: { overflow: 'hidden' },
  a: { padding: '0 0 16px', color: '#333', lineHeight: 1.5, whiteSpace: 'pre-wrap' },
  muted: { color: '#888', fontSize: 14, fontStyle: 'italic' },
  editorBadge: {
    fontSize: 11,
    color: '#9ca3af',
    padding: '4px 8px',
    background: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 8,
    display: 'inline-block',
  },
};
