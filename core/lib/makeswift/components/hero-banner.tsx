'use client';

import { Checkbox, Image, Link, List, Select, Shape, Style, TextInput } from '@makeswift/runtime/controls';
import { clsx } from 'clsx';

import { runtime } from '../runtime';

interface Slide {
  title: string;
  description: string;
  showDescription: boolean;
  image: string | undefined;
  ctaLabel: string;
  ctaHref: { href: string } | null;
  ctaVariant: string;
  showCta: boolean;
}

interface Props {
  slides: Slide[];
  className?: string;
}

function HeroBanner({ slides = [], className }: Props) {
  if (slides.length === 0) {
    return (
      <div
        className={clsx(
          'flex h-[50vh] items-center justify-center bg-[hsl(var(--contrast-100))] text-[hsl(var(--contrast-400))]',
          className,
        )}
      >
        Add slides in the MakeSwift editor
      </div>
    );
  }

  const slide = slides[0];

  return (
    <section
      className={clsx(
        'relative flex h-[80vh] items-end bg-[color-mix(in_oklab,hsl(var(--primary)),black_75%)] @container',
        className,
      )}
    >
      {slide?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={slide.title}
          className="absolute inset-0 h-full w-full object-cover"
          src={slide.image}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/80%)] to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 pb-16 pt-12 @xl:px-6 @xl:pb-20 @4xl:px-8">
        <h1 className="m-0 max-w-xl font-[family-name:var(--font-family-heading)] text-4xl font-medium leading-none text-[hsl(var(--background))] @2xl:text-5xl @4xl:text-6xl">
          {slide?.title}
        </h1>

        {slide?.showDescription && slide?.description && (
          <p className="mt-3 max-w-xl text-lg leading-normal text-[hsl(var(--background)/80%)]">
            {slide.description}
          </p>
        )}

        {slide?.showCta && slide?.ctaLabel && (
          <a
            className={clsx(
              'mt-8 inline-flex items-center rounded-full px-8 py-3 text-sm font-medium transition-opacity hover:opacity-80',
              slide.ctaVariant === 'primary'
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',
            )}
            href={slide.ctaHref?.href ?? '#'}
          >
            {slide.ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}

runtime.registerComponent(HeroBanner, {
  type: 'catalyst-hero-banner',
  label: 'Catalyst / Hero Banner',
  props: {
    className: Style(),
    slides: List({
      label: 'Slides',
      type: Shape({
        type: {
          title: TextInput({ label: 'Title', defaultValue: 'Welcome to our store' }),
          description: TextInput({ label: 'Description', defaultValue: 'Shop the latest arrivals' }),
          showDescription: Checkbox({ label: 'Show description', defaultValue: true }),
          image: Image({ label: 'Background image' }),
          ctaLabel: TextInput({ label: 'Button label', defaultValue: 'Shop now' }),
          ctaHref: Link({ label: 'Button link' }),
          ctaVariant: Select({
            label: 'Button style',
            options: [
              { label: 'Light', value: 'light' },
              { label: 'Primary', value: 'primary' },
            ],
            defaultValue: 'light',
          }),
          showCta: Checkbox({ label: 'Show button', defaultValue: true }),
        },
      }),
      getItemLabel: (item) => item?.title || 'Slide',
    }),
  },
});
