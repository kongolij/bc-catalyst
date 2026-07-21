'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Leaf {
  label?: string;
  href?: string;
}

interface Group {
  label?: string;
  href?: string;
  links?: Leaf[];
}

interface TopItem {
  label?: string;
  href?: string;
  groups?: Group[];
}

interface Props {
  className?: string;
  items?: TopItem[];
}

export function GesContentNavClient({ className, items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const list = items ?? [];

  return (
    <nav
      className={['ges-nav', className].filter(Boolean).join(' ')}
      onMouseLeave={() => setOpenIdx(null)}
    >
      <ul className="ges-nav__top">
        {list.map((item, i) => {
          const hasKids = (item.groups?.length ?? 0) > 0;

          return (
            <li
              key={i}
              className="ges-nav__top-item"
              onMouseEnter={() => setOpenIdx(i)}
            >
              {item.href ? (
                <Link className="ges-nav__top-link" href={item.href}>
                  {item.label}
                  {hasKids && <span className="ges-nav__caret">▾</span>}
                </Link>
              ) : (
                <span className="ges-nav__top-link">
                  {item.label}
                  {hasKids && <span className="ges-nav__caret">▾</span>}
                </span>
              )}

              {hasKids && openIdx === i && (
                <div className="ges-nav__dropdown">
                  <div
                    className="ges-nav__cols"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(item.groups!.length, 4)}, 1fr)`,
                    }}
                  >
                    {item.groups!.map((col, j) => (
                      <div key={j} className="ges-nav__col">
                        {col.href ? (
                          <Link className="ges-nav__col-title" href={col.href}>
                            {col.label}
                          </Link>
                        ) : (
                          <div className="ges-nav__col-title">{col.label}</div>
                        )}
                        {(col.links?.length ?? 0) > 0 && (
                          <ul className="ges-nav__col-links">
                            {col.links!.map((leaf, k) => (
                              <li key={k}>
                                {leaf.href ? (
                                  <Link className="ges-nav__leaf" href={leaf.href}>
                                    {leaf.label}
                                  </Link>
                                ) : (
                                  <span className="ges-nav__leaf">{leaf.label}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
