'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface L3 {
  entityId: number;
  name: string;
  path: string;
}

interface L2 extends L3 {
  children?: L3[];
}

interface L1 extends L3 {
  children?: L2[];
}

interface ManualLeaf {
  label?: string;
  href?: string;
}

interface ManualGroup {
  label?: string;
  href?: string;
  links?: ManualLeaf[];
}

interface ManualItem {
  label?: string;
  href?: string;
  groups?: ManualGroup[];
}

type Mode = 'auto-featured' | 'auto-all' | 'manual';

interface Props {
  className?: string;
  mode?: Mode;
  items?: ManualItem[];
}

function categoryHref(path: string) {
  return `/category${path.startsWith('/') ? path : `/${path}`}`;
}

export function GesCatalogNavClient({ className, mode = 'auto-featured', items }: Props) {
  const [tree, setTree] = useState<L1[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'manual') return;

    let cancelled = false;
    const url =
      mode === 'auto-featured' ? '/api/bc/nav-tree?filter=featured' : '/api/bc/nav-tree';

    fetch(url)
      .then((r) => r.json())
      .then((data: { tree: L1[] }) => {
        if (!cancelled) setTree(data.tree ?? []);
      })
      .catch(() => {
        if (!cancelled) setTree([]);
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const renderAuto = () => (
    <ul className="ges-nav__top">
      {tree.map((item) => {
        const hasKids = (item.children?.length ?? 0) > 0;
        const key = `api-${item.entityId}`;

        return (
          <li
            key={item.entityId}
            className="ges-nav__top-item"
            onMouseEnter={() => setOpenId(key)}
          >
            <Link className="ges-nav__top-link" href={categoryHref(item.path)}>
              {item.name}
              {hasKids && <span className="ges-nav__caret">▾</span>}
            </Link>

            {hasKids && openId === key && (
              <div className="ges-nav__dropdown">
                <div
                  className="ges-nav__cols"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(item.children!.length, 4)}, 1fr)`,
                  }}
                >
                  {item.children!.map((col) => (
                    <div key={col.entityId} className="ges-nav__col">
                      <Link className="ges-nav__col-title" href={categoryHref(col.path)}>
                        {col.name}
                      </Link>
                      {(col.children?.length ?? 0) > 0 && (
                        <ul className="ges-nav__col-links">
                          {col.children!.map((leaf) => (
                            <li key={leaf.entityId}>
                              <Link className="ges-nav__leaf" href={categoryHref(leaf.path)}>
                                {leaf.name}
                              </Link>
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
  );

  const renderManual = () => {
    const list = items ?? [];

    return (
      <ul className="ges-nav__top">
        {list.map((item, i) => {
          const hasKids = (item.groups?.length ?? 0) > 0;
          const key = `manual-${i}`;

          return (
            <li
              key={i}
              className="ges-nav__top-item"
              onMouseEnter={() => setOpenId(key)}
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

              {hasKids && openId === key && (
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
    );
  };

  return (
    <nav
      className={['ges-nav', className].filter(Boolean).join(' ')}
      onMouseLeave={() => setOpenId(null)}
    >
      {mode === 'manual' ? renderManual() : renderAuto()}
    </nav>
  );
}
