'use client';

import { useIsInBuilder } from '@makeswift/runtime/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { useId, useMemo } from 'react';

import { useFaqSectionContext } from './context';

interface BaseItem {
  id: string;
  question: string;
  answer: string;
}

type ComboValue = string | { value?: string; id?: string } | undefined;

interface HiddenId {
  id?: ComboValue;
}

interface Override {
  itemId?: ComboValue;
  questionOverride?: string;
  answerOverride?: string;
}

interface AdditionalItem {
  question?: string;
  answer?: string;
}

interface Props {
  title: string;
  categorySlug: string;
  baseItems: BaseItem[];
  hiddenItemIds?: HiddenId[];
  overrides?: Override[];
  additionalItems?: AdditionalItem[];
}

function comboToString(v: ComboValue): string {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    const raw = v.value ?? v.id ?? '';
    return typeof raw === 'string' ? raw.trim() : '';
  }
  return '';
}

export function FaqSection({
  title,
  categorySlug,
  baseItems,
  hiddenItemIds,
  overrides,
  additionalItems,
}: Props) {
  const { activeSlug } = useFaqSectionContext();
  const isInBuilder = useIsInBuilder();

  const items = useMemo(() => {
    const hidden = new Set(
      (hiddenItemIds ?? []).map((h) => comboToString(h.id)).filter(Boolean),
    );
    const overrideMap = new Map<string, Override>();
    (overrides ?? []).forEach((o) => {
      const key = comboToString(o.itemId);
      if (key) overrideMap.set(key, o);
    });

    const merged: BaseItem[] = baseItems
      .filter((i) => !hidden.has(i.id))
      .map((i) => {
        const o = overrideMap.get(i.id);
        if (!o) return i;
        return {
          ...i,
          question: o.questionOverride?.trim() ? o.questionOverride : i.question,
          answer: o.answerOverride?.trim() ? o.answerOverride : i.answer,
        };
      });

    (additionalItems ?? []).forEach((n, idx) => {
      const q = (n.question ?? '').trim();
      if (!q) return;
      merged.push({
        id: `custom-${categorySlug}-${idx}`,
        question: q,
        answer: n.answer ?? '',
      });
    });

    return merged;
  }, [baseItems, hiddenItemIds, overrides, additionalItems, categorySlug]);

  if (!isInBuilder && activeSlug !== categorySlug) return null;

  const editorBadge = isInBuilder && activeSlug !== categorySlug;

  return (
    <section style={styles.wrap}>
      {editorBadge ? (
        <div style={styles.editorBadge}>
          Editor preview — visible on the live site when the sidebar filter is set to “{title}”
        </div>
      ) : null}
      <h2 style={styles.title}>{title}</h2>
      {items.length === 0 ? (
        <p style={styles.muted}>No items — every item has been hidden.</p>
      ) : (
        <AccordionPrimitive.Root type="multiple">
          {items.map((it) => (
            <AccordionRow answer={it.answer} key={it.id} question={it.question} />
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
  muted: { color: '#888', fontSize: 14 },
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
