'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx } from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';

interface FaqAccordionItem {
  title: string;
  bgColor?: string;
  textColor?: string;
  classNameCss?: string;
  children: ReactNode;
}

interface FaqSection {
  title: string;
  className?: string;
  accordions: FaqAccordionItem[];
  type: 'single' | 'multiple';
  colorScheme: 'light' | 'dark';
}

interface FilterSection {
  title: string;
  description: string;
  filterObjList: Array<{ title: string }>;
}

interface Props {
  filterObj?: FilterSection;
  diffAccrodions?: FaqSection[];
}

function FaqAccordionItem({
  title,
  bgColor,
  textColor,
  classNameCss,
  colorScheme,
  children,
  ...rest
}: FaqAccordionItem & { colorScheme: 'light' | 'dark' } & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AccordionPrimitive.Item {...rest} className="mb-3 border-b border-gray-300 pb-2">
      <AccordionPrimitive.Header
        className={clsx('flex min-h-[40px] items-center', classNameCss)}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-start gap-8 py-3 text-start focus:outline-none">
          <div className="flex-1 select-none text-base font-medium transition-colors duration-300 ease-out">
            {title}
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
      <AccordionPrimitive.Content
        className={clsx(
          'overflow-hidden',
          isMounted && 'data-[state=closed]:animate-collapse data-[state=open]:animate-expand',
        )}
      >
        <div className="w-full py-3">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

export function FaqComp({ filterObj, diffAccrodions = [] }: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const visibleSections = activeFilter
    ? diffAccrodions.filter((s) => s.title === activeFilter)
    : diffAccrodions;

  return (
    <div className="w-full">
      {filterObj && (
        <div className="mb-6">
          {filterObj.title && (
            <h2 className="mb-3 text-xl font-semibold">{filterObj.title}</h2>
          )}
          <div className="flex flex-wrap gap-2">
            {activeFilter && (
              <button
                className="rounded-full border border-gray-300 px-4 py-1 text-sm hover:bg-gray-100"
                onClick={() => setActiveFilter(null)}
              >
                {filterObj.description}
              </button>
            )}
            {filterObj.filterObjList.map((filter, i) => (
              <button
                className={clsx(
                  'rounded-full border px-4 py-1 text-sm transition-colors',
                  activeFilter === filter.title
                    ? 'border-[#E06A26] bg-[#E06A26] text-white'
                    : 'border-gray-300 hover:bg-gray-100',
                )}
                key={i}
                onClick={() =>
                  setActiveFilter(activeFilter === filter.title ? null : filter.title)
                }
              >
                {filter.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {visibleSections.map((section, sIndex) => (
          <div key={sIndex} className={section.className}>
            {section.title && (
              <h3 className="mb-3 text-lg font-semibold">{section.title}</h3>
            )}
            <AccordionPrimitive.Root
              collapsible={section.type === 'single' ? true : undefined}
              type={section.type}
            >
              {section.accordions.map((accordion, aIndex) => (
                <FaqAccordionItem
                  colorScheme={section.colorScheme}
                  key={aIndex}
                  value={aIndex.toString()}
                  {...accordion}
                />
              ))}
            </AccordionPrimitive.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
