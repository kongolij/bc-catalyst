'use client';

import { useEffect, useState } from 'react';

import {
  Checkbox,
  Image,
  Link,
  List,
  Select,
  Shape,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';
import { clsx } from 'clsx';

import { runtime } from '../runtime';

interface BcProduct {
  id: string;
  name: string;
  path: string;
  image: string | null;
  imageAlt: string;
  price: string;
  salePrice: string;
}

interface ManualProduct {
  name: string;
  price: string;
  image: { url: string; dimensions: { width: number; height: number } } | null;
  href: { href: string } | null;
  badge: string;
  showBadge: boolean;
}

interface Props {
  source: string;
  categoryPath: string;
  productIds: string;
  title: string;
  description: string;
  showDescription: boolean;
  products: ManualProduct[];
  columns: string;
  ctaLabel: string;
  ctaHref: { href: string } | null;
  showCta: boolean;
  className?: string;
}

function ProductGrid({
  source = 'manual',
  categoryPath = '',
  productIds = '',
  title,
  description,
  showDescription,
  products: manualProducts = [],
  columns = '4',
  ctaLabel,
  ctaHref,
  showCta,
  className,
}: Props) {
  const [bcProducts, setBcProducts] = useState<BcProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (source === 'manual') {
      setBcProducts([]);
      return;
    }

    const params = new URLSearchParams();

    if (source === 'category' && categoryPath.trim()) {
      params.set('categoryPath', categoryPath.trim());
    } else if (source === 'products' && productIds.trim()) {
      params.set('entityIds', productIds.trim());
    } else {
      setBcProducts([]);
      return;
    }

    setLoading(true);
    fetch(`/api/bc/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setBcProducts(data as BcProduct[]);
      })
      .catch(() => setBcProducts([]))
      .finally(() => setLoading(false));
  }, [source, categoryPath, productIds]);

  const gridClass = clsx(
    'grid gap-6',
    columns === '2' && 'grid-cols-1 @md:grid-cols-2',
    columns === '3' && 'grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3',
    columns === '4' && 'grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4',
  );

  const isEmpty =
    source === 'manual' ? manualProducts.length === 0 : !loading && bcProducts.length === 0;

  const emptyLabel =
    source === 'category'
      ? 'Enter a category path in the panel (e.g. /bulldozers)'
      : source === 'products'
        ? 'Enter product IDs in the panel (e.g. 123, 456)'
        : 'Add products in the MakeSwift editor';

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

        {loading ? (
          <div className="grid h-64 place-items-center rounded-xl bg-[hsl(var(--contrast-100))] text-[hsl(var(--contrast-400))]">
            Loading products…
          </div>
        ) : isEmpty ? (
          <div className="grid h-64 place-items-center rounded-xl bg-[hsl(var(--contrast-100))] text-[hsl(var(--contrast-400))]">
            {emptyLabel}
          </div>
        ) : source === 'manual' ? (
          <ul className={gridClass}>
            {manualProducts.map((product, idx) => (
              <li key={idx}>
                <a className="group block" href={product.href?.href ?? '#'}>
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-[hsl(var(--contrast-100))]">
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
        ) : (
          <ul className={gridClass}>
            {bcProducts.map((product) => (
              <li key={product.id}>
                <a className="group block" href={product.path}>
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-[hsl(var(--contrast-100))]">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={product.imageAlt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.image}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[hsl(var(--contrast-300))]">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-[hsl(var(--foreground))] group-hover:underline">
                    {product.name}
                  </h3>
                  {product.salePrice ? (
                    <p className="mt-1 text-sm text-[hsl(var(--contrast-500))]">
                      <span className="text-red-600">{product.salePrice}</span>{' '}
                      <span className="line-through">{product.price}</span>
                    </p>
                  ) : (
                    product.price && (
                      <p className="mt-1 text-sm text-[hsl(var(--contrast-500))]">{product.price}</p>
                    )
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
    source: Select({
      label: 'Product source',
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'By category path', value: 'category' },
        { label: 'By product IDs', value: 'products' },
      ],
      defaultValue: 'manual',
    }),
    categoryPath: TextInput({ label: 'Category path (e.g. /bulldozers)', defaultValue: '' }),
    productIds: TextInput({ label: 'Product IDs, comma-separated (e.g. 123, 456)', defaultValue: '' }),
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
      label: 'Products (manual only)',
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
      getItemLabel: (item) => item?.name ?? 'Product',
    }),
  },
});
