'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TopLevelCategory {
  entityId: number;
  name: string;
  path: string;
  productCount: number;
  image: { url: string; altText: string } | null;
}

interface Props {
  className?: string;
  categoryId?: string;
  titleOverride?: string;
  iconUrl?: string;
  hrefOverride?: string;
}

export function GesCategoryCardClient({
  className,
  categoryId,
  titleOverride,
  iconUrl,
  hrefOverride,
}: Props) {
  const [cat, setCat] = useState<TopLevelCategory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    setLoading(true);
    fetch('/api/bc/categories/top-level')
      .then((r) => r.json())
      .then((data: { categories: TopLevelCategory[] }) => {
        if (cancelled) return;
        const idNum = Number(categoryId);
        const found = data.categories?.find((c) => c.entityId === idNum) ?? null;

        setCat(found);
      })
      .catch(() => {
        if (!cancelled) setCat(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const title = titleOverride || cat?.name || (loading ? 'Loading…' : 'Set category');
  const href =
    hrefOverride ||
    (cat?.path ? `/category${cat.path.startsWith('/') ? cat.path : `/${cat.path}`}` : '#');
  const image = iconUrl || cat?.image?.url || '';

  const content = (
    <div className={['ges-cat-card', className].filter(Boolean).join(' ')}>
      <div className="ges-cat-card__icon">
        {image ? <img alt={title} src={image} /> : <div className="ges-cat-card__placeholder" />}
      </div>
      <div className="ges-cat-card__label">{title}</div>
    </div>
  );

  if (href === '#') return content;

  return (
    <Link className="ges-cat-card__link" href={href}>
      {content}
    </Link>
  );
}
