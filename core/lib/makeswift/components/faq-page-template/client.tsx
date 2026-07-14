'use client';

import { clsx } from 'clsx';
import { type ReactNode } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  title?: string;
  eyebrow?: string;
  description?: string;
  variation?: 'centered' | 'sidebar' | 'split';
  categoryTitle?: string;
  categories?: Array<{ label: string }>;
  faqs?: FaqItem[];
  top?: ReactNode;
  bottom?: ReactNode;
  className?: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: 'How do I update this FAQ?',
    answer: 'Select the FAQ Page Template and edit the FAQ items in the right panel.',
  },
  {
    question: 'Can I add content above or below the FAQs?',
    answer: 'Yes. Use the top and bottom slots to add Makeswift content around this template.',
  },
  {
    question: 'Can I use a different layout?',
    answer: 'Yes. Change the template variation setting to centered, sidebar, or split.',
  },
];

function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="divide-y divide-[hsl(var(--contrast-200))] border-y border-[hsl(var(--contrast-200))]">
      {faqs.map((faq, index) => (
        <details className="group" key={`${faq.question}-${index}`}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left">
            <span className="text-lg font-medium leading-snug text-[hsl(var(--foreground))]">
              {faq.question}
            </span>
            <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[hsl(var(--contrast-300))] text-sm leading-none text-[hsl(var(--foreground))] group-open:hidden">
              +
            </span>
            <span className="mt-1 hidden h-6 w-6 shrink-0 place-items-center rounded-full border border-[hsl(var(--contrast-300))] text-sm leading-none text-[hsl(var(--foreground))] group-open:grid">
              -
            </span>
          </summary>
          <div className="pb-6 pr-10 text-base leading-7 text-[hsl(var(--contrast-500))]">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

function Header({ eyebrow, title, description }: Pick<Props, 'description' | 'eyebrow' | 'title'>) {
  return (
    <header>
      {eyebrow != null && eyebrow !== '' && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[hsl(var(--primary))]">
          {eyebrow}
        </p>
      )}
      <h1 className="font-[family-name:var(--font-family-heading)] text-4xl font-medium leading-none text-[hsl(var(--foreground))] @3xl:text-5xl">
        {title}
      </h1>
      {description != null && description !== '' && (
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[hsl(var(--contrast-500))]">
          {description}
        </p>
      )}
    </header>
  );
}

export function FaqPageTemplate({
  title = 'Frequently asked questions',
  eyebrow = 'Support',
  description = 'Find answers to common questions. Add, remove, or reorder FAQ items from the Makeswift panel.',
  variation = 'centered',
  categoryTitle = 'Topics',
  categories = [{ label: 'Ordering' }, { label: 'Shipping' }, { label: 'Returns' }],
  faqs = defaultFaqs,
  top,
  bottom,
  className,
}: Props) {
  const items = faqs.length > 0 ? faqs : defaultFaqs;

  if (variation === 'sidebar') {
    return (
      <section className={clsx('w-full px-4 py-14 @container @4xl:px-8', className)}>
        {top}
        <div className="mx-auto grid max-w-screen-xl gap-10 @4xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <Header description={description} eyebrow={eyebrow} title={title} />
            <nav aria-label="FAQ topics" className="space-y-2">
              <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{categoryTitle}</p>
              <ul className="space-y-2 text-sm text-[hsl(var(--contrast-500))]">
                {categories.map((category, index) => (
                  <li key={`${category.label}-${index}`}>{category.label}</li>
                ))}
              </ul>
            </nav>
          </aside>
          <FaqList faqs={items} />
        </div>
        {bottom}
      </section>
    );
  }

  if (variation === 'split') {
    return (
      <section className={clsx('w-full px-4 py-14 @container @4xl:px-8', className)}>
        {top}
        <div className="mx-auto grid max-w-screen-xl gap-10 @4xl:grid-cols-[0.8fr_1.2fr] @4xl:items-start">
          <div className="rounded-lg bg-[hsl(var(--contrast-100))] p-8">
            <Header description={description} eyebrow={eyebrow} title={title} />
          </div>
          <FaqList faqs={items} />
        </div>
        {bottom}
      </section>
    );
  }

  return (
    <section className={clsx('w-full px-4 py-14 @container @4xl:px-8', className)}>
      {top}
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <Header description={description} eyebrow={eyebrow} title={title} />
        </div>
        <FaqList faqs={items} />
      </div>
      {bottom}
    </section>
  );
}
