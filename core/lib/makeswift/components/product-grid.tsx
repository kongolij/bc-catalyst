'use client';

import { Checkbox, Image, Link, List, Select, Shape, Style, TextInput } from '@makeswift/runtime/controls';
import { clsx } from 'clsx';

import { runtime } from '../runtime';

interface ProductItem {
  name: string;
  price: string;
  image: { url: string; dimensions: { width: number; height: number } } | null;
  href: { href: string } | null;
  badge: string;
  showBadge: boolean;
}

interface Props {
  title: string;
  description: string;
  showDescription: boolean;
  products: ProductItem[];
  columns: string;
  ctaLabel: string;
  ctaHref: { href: string } | null;
  showCta: boolean;
  className?: string;
}

function ProductGrid({
  title,
  description,
  showDescription,
  products = [],
  columns = '4',
  ctaLabel,
  ctaHref,
  showCta,
  className,
}: Props) {
  return (
    <section className={clsx('w-full px-4 py-16 @container @xl:px-6 @4xl:px-8', className)}>
      <div className="mx-auto max-w-screen-2xl">
        <header className="mb-10 flex flex-col gap-3 @xl:flex-row @xl:items-end @xl:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-family-heading)] text-4xl font-medium leading-none text-[hsl(var(--foreground))] @4xl:text-5xl">
              {title}
            </h2>
            {showDescription && description && (
              <p className="mt-3 max-w-xl text-lg leading-normal text-[hsl(var(--contrast-500))]">
                {description}
              </p>
            )}
          </div>

          {showCta && ctaLabel && (
            <a
              className="shrink-0 text-sm font-medium text-[hsl(var(--foreground))] underline-offset-4 hover:underline"
              href={ctaHref?.href ?? '#'}
            >
              {ctaLabel} →
            </a>
          )}
        </header>

        {products.length === 0 ? (
          <div className="grid h-64 place-items-center rounded-xl bg-[hsl(var(--contrast-100))] text-[hsl(var(--contrast-400))]">
            Add products in the MakeSwift editor
          </div>
        ) : (
          <ul
            className={clsx(
              'grid gap-6',
              columns === '2' && 'grid-cols-1 @md:grid-cols-2',
              columns === '3' && 'grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3',
              columns === '4' && 'grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4',
            )}
          >
            {products.map((product, idx) => (
              <li key={idx}>
                <a
                  className="group block"
                  href={product.href?.href ?? '#'}
                >
                  <div className="relative mb-4 overflow-hidden rounded-xl bg-[hsl(var(--contrast-100))] aspect-square">
                    {product.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.image.url}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[hsl(var(--contrast-300))]">
                        No image
                      </div>
                    )}

                    {product.showBadge && product.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-[hsl(var(--primary))] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--primary-foreground))]">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-medium text-[hsl(var(--foreground))] group-hover:underline">
                    {product.name}
                  </h3>

                  {product.price && (
                    <p className="mt-1 text-sm text-[hsl(var(--contrast-500))]">{product.price}</p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

runtime.registerComponent(ProductGrid, {
  type: 'catalyst-product-grid',
  label: 'Catalyst / Product Grid',
  props: {
    className: Style(),
    title: TextInput({ label: 'Section title', defaultValue: 'Featured products' }),
    description: TextInput({ label: 'Description', defaultValue: '' }),
    showDescription: Checkbox({ label: 'Show description', defaultValue: false }),
    columns: Select({
      label: 'Columns',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
      defaultValue: '4',
    }),
    ctaLabel: TextInput({ label: 'View all label', defaultValue: 'View all' }),
    ctaHref: Link({ label: 'View all link' }),
    showCta: Checkbox({ label: 'Show view all link', defaultValue: true }),
    products: List({
      label: 'Products',
      type: Shape({
        type: {
          name: TextInput({ label: 'Product name', defaultValue: 'Product name' }),
          price: TextInput({ label: 'Price', defaultValue: '$0.00' }),
          image: Image({ label: 'Product image' }),
          href: Link({ label: 'Product link' }),
          badge: TextInput({ label: 'Badge text', defaultValue: 'New' }),
          showBadge: Checkbox({ label: 'Show badge', defaultValue: false }),
        },
      }),
      getItemLabel: (item) => item?.name || 'Product',
    }),
  },
});
