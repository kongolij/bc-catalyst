'use client';

import { Checkbox, Link, Select, Style, TextInput } from '@makeswift/runtime/controls';
import { clsx } from 'clsx';

import { runtime } from '../runtime';

interface Props {
  eyebrow: string;
  showEyebrow: boolean;
  title: string;
  description: string;
  showDescription: boolean;
  ctaLabel: string;
  ctaHref: { href: string } | null;
  showCta: boolean;
  alignment: string;
  background: string;
  className?: string;
}

function PromoBanner({
  eyebrow,
  showEyebrow,
  title,
  description,
  showDescription,
  ctaLabel,
  ctaHref,
  showCta,
  alignment = 'center',
  background = 'light',
  className,
}: Props) {
  return (
    <section
      className={clsx(
        'w-full px-4 py-16 @container @xl:px-6 @xl:py-20 @4xl:px-8',
        background === 'dark' && 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]',
        background === 'light' && 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',
        background === 'muted' && 'bg-[hsl(var(--contrast-100))] text-[hsl(var(--foreground))]',
        background === 'primary' && 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
        className,
      )}
    >
      <div
        className={clsx(
          'mx-auto max-w-screen-2xl',
          alignment === 'center' && 'text-center',
          alignment === 'left' && 'text-left',
          alignment === 'right' && 'text-right',
        )}
      >
        {showEyebrow && eyebrow && (
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest opacity-60">
            {eyebrow}
          </p>
        )}

        <h2 className="font-[family-name:var(--font-family-heading)] text-4xl font-medium leading-none @2xl:text-5xl @4xl:text-6xl">
          {title}
        </h2>

        {showDescription && description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed opacity-80">
            {description}
          </p>
        )}

        {showCta && ctaLabel && (
          <div className={clsx('mt-8', alignment === 'center' && 'flex justify-center')}>
            <a
              className={clsx(
                'inline-flex items-center rounded-full px-8 py-3 text-sm font-medium transition-opacity hover:opacity-80',
                background === 'dark' || background === 'primary'
                  ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]'
                  : 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]',
              )}
              href={ctaHref?.href ?? '#'}
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

runtime.registerComponent(PromoBanner, {
  type: 'catalyst-promo-banner',
  label: 'Catalyst / Promo Banner',
  props: {
    className: Style(),
    eyebrow: TextInput({ label: 'Eyebrow text', defaultValue: 'New collection' }),
    showEyebrow: Checkbox({ label: 'Show eyebrow', defaultValue: true }),
    title: TextInput({ label: 'Title', defaultValue: 'Discover our latest arrivals' }),
    description: TextInput({
      label: 'Description',
      defaultValue: 'Explore the newest additions to our catalog.',
    }),
    showDescription: Checkbox({ label: 'Show description', defaultValue: true }),
    ctaLabel: TextInput({ label: 'Button label', defaultValue: 'Shop now' }),
    ctaHref: Link({ label: 'Button link' }),
    showCta: Checkbox({ label: 'Show button', defaultValue: true }),
    alignment: Select({
      label: 'Text alignment',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
    }),
    background: Select({
      label: 'Background',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Muted', value: 'muted' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
      ],
      defaultValue: 'light',
    }),
  },
});
