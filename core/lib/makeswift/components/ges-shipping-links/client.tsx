'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LinkItem {
  label?: string;
  href?: string;
}

interface Data {
  title: string;
  description?: string;
  links: LinkItem[];
}

interface Props {
  className?: string;
  source?: 'api' | 'manual';
  title?: string;
  description?: string;
  links?: LinkItem[];
}

export function GesShippingLinksClient({
  className,
  source = 'api',
  title,
  description,
  links,
}: Props) {
  const [apiData, setApiData] = useState<Data | null>(null);

  useEffect(() => {
    if (source !== 'api') return;
    let cancelled = false;
    fetch('/api/ges/show-links?section=shipping')
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
  const resolvedDesc = source === 'api' ? apiData?.description ?? '' : description ?? '';
  const resolvedLinks: LinkItem[] = source === 'api' ? apiData?.links ?? [] : links ?? [];

  if (source === 'api' && !apiData) return null;

  return (
    <section className={['ges-shipping-links', className].filter(Boolean).join(' ')}>
      {resolvedTitle ? <h2 className="ges-shipping-links__title">{resolvedTitle}</h2> : null}
      {resolvedDesc ? <p className="ges-shipping-links__desc">{resolvedDesc}</p> : null}
      {resolvedLinks.length > 0 ? (
        <ul className="ges-shipping-links__list">
          {resolvedLinks.map((l, i) =>
            l.label && l.href ? (
              <li key={i} className="ges-shipping-links__item">
                <Link className="ges-shipping-links__link" href={l.href}>
                  <span>{l.label}</span>
                  <span className="ges-shipping-links__chevron" aria-hidden>
                    ›
                  </span>
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      ) : null}
    </section>
  );
}
