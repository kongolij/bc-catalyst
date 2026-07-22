'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LinkItem {
  label?: string;
  href?: string;
}

interface Data {
  title: string;
  links: LinkItem[];
}

interface Props {
  className?: string;
  source?: 'api' | 'manual';
  title?: string;
  columns?: number;
  links?: LinkItem[];
}

export function GesResourcesLinksClient({
  className,
  source = 'api',
  title,
  columns = 2,
  links,
}: Props) {
  const [apiData, setApiData] = useState<Data | null>(null);

  useEffect(() => {
    if (source !== 'api') return;
    let cancelled = false;
    fetch('/api/ges/show-links?section=resources')
      .then((r) => r.json())
      .then((data: Data) => {
        if (!cancelled) setApiData(data);
      })
      .catch(() => {
        if (!cancelled) setApiData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  const resolvedTitle = source === 'api' ? apiData?.title ?? '' : title ?? '';
  const resolvedLinks: LinkItem[] = source === 'api' ? apiData?.links ?? [] : links ?? [];

  if (source === 'api' && !apiData) return null;

  return (
    <section className={['ges-resources-links', className].filter(Boolean).join(' ')}>
      {resolvedTitle ? <h2 className="ges-resources-links__title">{resolvedTitle}</h2> : null}
      {resolvedLinks.length > 0 ? (
        <ul
          className="ges-resources-links__list"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))` }}
        >
          {resolvedLinks.map((l, i) =>
            l.label && l.href ? (
              <li key={i} className="ges-resources-links__item">
                <span className="ges-resources-links__marker" aria-hidden>
                  ›
                </span>
                <Link className="ges-resources-links__link" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      ) : null}
    </section>
  );
}
