'use client';

import { useEffect, useState } from 'react';

interface Contact {
  label?: string;
  number?: string;
}

interface Data {
  title: string;
  contacts: Contact[];
}

interface Props {
  className?: string;
  source?: 'api' | 'manual';
  title?: string;
  contacts?: Contact[];
}

function telHref(num: string): string {
  return 'tel:' + num.replace(/[^\d+]/g, '');
}

export function GesNeedHelpClient({ className, source = 'api', title, contacts }: Props) {
  const [apiData, setApiData] = useState<Data | null>(null);

  useEffect(() => {
    if (source !== 'api') return;
    let cancelled = false;
    fetch('/api/ges/show-links?section=help')
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
  const resolvedContacts: Contact[] =
    source === 'api' ? apiData?.contacts ?? [] : contacts ?? [];

  if (source === 'api' && !apiData) return null;

  return (
    <section className={['ges-need-help', className].filter(Boolean).join(' ')}>
      {resolvedTitle ? <h3 className="ges-need-help__title">{resolvedTitle}</h3> : null}
      {resolvedContacts.length > 0 ? (
        <ul className="ges-need-help__list">
          {resolvedContacts.map((c, i) =>
            c.number ? (
              <li key={i} className="ges-need-help__row">
                <span className="ges-need-help__icon" aria-hidden>
                  ☎
                </span>
                <a className="ges-need-help__link" href={telHref(c.number)}>
                  {c.number}
                </a>
                {c.label ? <span className="ges-need-help__label">{c.label}</span> : null}
              </li>
            ) : null,
          )}
        </ul>
      ) : null}
    </section>
  );
}
