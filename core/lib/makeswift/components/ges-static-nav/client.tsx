'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Leaf {
  label?: string;
  href?: string;
}

interface Column {
  label?: string;
  href?: string;
  links?: Leaf[];
}

interface Item {
  label?: string;
  href?: string;
  groups?: Column[];
}

interface Props {
  className?: string;
  items?: Item[];
}

export function GesStaticNavClient({ className, items }: Props) {
  const list = items ?? [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [hoveredColIdx, setHoveredColIdx] = useState<number | null>(null);

  const activeItem = openIdx != null ? list[openIdx] : null;
  const columns = activeItem?.groups ?? [];
  const activeCol = hoveredColIdx != null ? columns[hoveredColIdx] : columns[0];
  const activeLinks = activeCol?.links ?? [];

  return (
    <nav
      className={['ges-nav', className].filter(Boolean).join(' ')}
      onMouseLeave={() => {
        setOpenIdx(null);
        setHoveredColIdx(null);
      }}
    >
      <ul className="ges-nav__top">
        {list.map((item, i) => {
          const hasKids = (item.groups?.length ?? 0) > 0;

          return (
            <li
              key={i}
              className="ges-nav__top-item"
              onMouseEnter={() => {
                setOpenIdx(i);
                setHoveredColIdx(0);
              }}
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
                <div className="ges-nav__cascade">
                  <div className="ges-nav__pane ges-nav__pane--l2">
                    <div className="ges-nav__pane-label">Sections</div>
                    <ul className="ges-nav__pane-list">
                      {columns.map((col, j) => {
                        const isActive = j === (hoveredColIdx ?? 0);

                        return (
                          <li
                            key={j}
                            className={[
                              'ges-nav__pane-item',
                              isActive ? 'ges-nav__pane-item--active' : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            onMouseEnter={() => setHoveredColIdx(j)}
                          >
                            {col.href ? (
                              <Link className="ges-nav__pane-link" href={col.href}>
                                {col.label}
                                {(col.links?.length ?? 0) > 0 && (
                                  <span className="ges-nav__pane-chev">›</span>
                                )}
                              </Link>
                            ) : (
                              <span className="ges-nav__pane-link">
                                {col.label}
                                {(col.links?.length ?? 0) > 0 && (
                                  <span className="ges-nav__pane-chev">›</span>
                                )}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {activeLinks.length > 0 && (
                    <div className="ges-nav__pane ges-nav__pane--l3">
                      <div className="ges-nav__pane-label">{activeCol?.label}</div>
                      <ul className="ges-nav__pane-list">
                        {activeLinks.map((leaf, k) => (
                          <li key={k} className="ges-nav__pane-item">
                            {leaf.href ? (
                              <Link className="ges-nav__pane-link" href={leaf.href}>
                                {leaf.label}
                              </Link>
                            ) : (
                              <span className="ges-nav__pane-link">{leaf.label}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
