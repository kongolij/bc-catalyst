'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx } from 'clsx';
import { useEffect, useMemo, type ReactNode } from 'react';

import { useFaqContext } from './context';

interface AccordionItemInput {
  title?: string;
  bgColor?: string;
  textColor?: string;
  classNameCss?: string;
  children?: ReactNode;
}

interface Props {
  className?: string;
  categorySlug?: string;
  title?: string;
  accordions?: AccordionItemInput[];
  type?: 'single' | 'multiple';
  colorScheme?: 'light' | 'dark';
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function GesFaqSectionClient({
  className,
  categorySlug,
  title = 'Section',
  accordions = [],
  type = 'multiple',
  colorScheme = 'light',
}: Props) {
  const ctx = useFaqContext();
  const resolvedSlug = useMemo(() => {
    const raw = (categorySlug ?? '').trim();
    return raw || slugify(title || 'section');
  }, [categorySlug, title]);

  useEffect(() => {
    if (!ctx) return;
    ctx.registerSection({ slug: resolvedSlug, title });
    return () => ctx.unregisterSection(resolvedSlug);
  }, [ctx, resolvedSlug, title]);

  if (ctx && ctx.activeSlug && ctx.activeSlug !== resolvedSlug) {
    return null;
  }

  return (
    <div className={clsx('ges-faq-poc__section', className)} style={{ marginBottom: 24 }}>
      {title ? (
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>{title}</h3>
      ) : null}
      <AccordionPrimitive.Root
        collapsible={type === 'single' ? true : undefined}
        type={type}
      >
        {accordions.map((a, i) => (
          <AccordionPrimitive.Item
            key={i}
            value={`${resolvedSlug}-${i}`}
            className="mb-3 border-b border-gray-300 pb-2"
          >
            <AccordionPrimitive.Header
              className={clsx('flex min-h-[40px] items-center', a.classNameCss)}
              style={{ backgroundColor: a.bgColor, color: a.textColor }}
            >
              <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-start gap-8 py-3 text-start focus:outline-none">
                <div className="flex-1 select-none text-base font-medium">
                  {a.title || 'Untitled'}
                </div>
                <svg
                  className={clsx(
                    'mt-1 shrink-0 [&>line]:origin-center [&>line]:transition [&>line]:duration-300 [&>line]:ease-out',
                    colorScheme === 'dark' ? 'stroke-white' : 'stroke-[#E06A26]',
                  )}
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
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden">
              <div className="w-full py-3">{a.children}</div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </div>
  );
}
