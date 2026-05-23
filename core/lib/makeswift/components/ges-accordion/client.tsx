'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx } from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';

interface GesAccordionItem {
  title: string;
  bgColor?: string;
  textColor?: string;
  classNameCss?: string;
  children: ReactNode;
}

interface Props {
  className?: string;
  type: 'single' | 'multiple';
  colorScheme: 'light' | 'dark';
  accordions: GesAccordionItem[];
}

function AccordionItem({
  title,
  bgColor,
  textColor,
  classNameCss,
  colorScheme,
  children,
  ...rest
}: GesAccordionItem & { colorScheme: 'light' | 'dark' } & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AccordionPrimitive.Item {...rest} className="mb-3 border-b border-gray-400 pb-2">
      <AccordionPrimitive.Header
        className={clsx('flex min-h-[40px] items-center', classNameCss)}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-start gap-8 py-3 text-start focus:outline-none @md:py-4">
          <div className="flex-1 select-none text-[20px] font-medium transition-colors duration-300 ease-out">
            {title}
          </div>
          <svg
            className={clsx(
              'mt-1 shrink-0 [&>line]:origin-center [&>line]:transition [&>line]:duration-300 [&>line]:ease-out',
              colorScheme === 'dark' ? 'stroke-white' : 'stroke-[#E06A26]',
            )}
            viewBox="0 0 10 10"
            width={17}
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

export function GesAccordion({ className, accordions, colorScheme, type }: Props) {
  return (
    <AccordionPrimitive.Root
      className={className}
      collapsible={type === 'single' ? true : undefined}
      type={type}
    >
      {accordions.length < 1 && (
        <div className="p-4 text-center text-lg text-gray-400">Add accordions</div>
      )}
      {accordions.map(({ title, children, bgColor, textColor, classNameCss }, index) => (
        <AccordionItem
          bgColor={bgColor}
          classNameCss={classNameCss}
          colorScheme={colorScheme}
          key={index}
          textColor={textColor}
          title={title}
          value={index.toString()}
        >
          {children}
        </AccordionItem>
      ))}
    </AccordionPrimitive.Root>
  );
}
