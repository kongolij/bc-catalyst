'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { useId } from 'react';

interface Props {
  question?: string;
  answer?: string;
}

export function FaqItem({ question = 'New question', answer = '' }: Props) {
  const id = useId();

  return (
    <AccordionPrimitive.Root collapsible type="single">
      <AccordionPrimitive.Item style={styles.item} value={id}>
        <AccordionPrimitive.Header>
          <AccordionPrimitive.Trigger style={styles.trigger}>
            <span style={styles.question}>{question}</span>
            <Chevron />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content style={styles.content}>
          <div style={styles.answer}>{answer}</div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
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
  question: { flex: 1 },
  content: { overflow: 'hidden' },
  answer: { padding: '0 0 16px', color: '#333', lineHeight: 1.5, whiteSpace: 'pre-wrap' },
};
