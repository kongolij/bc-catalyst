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

interface Props {
  className?: string;
}

function categoryHref(path: string) {
  return `/category${path.startsWith('/') ? path : `/${path}`}`;
}

export function GesCatalogNavClient({ className }: Props) {
  const [tree, setTree] = useState<L1[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/bc/nav-tree')
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
  }, []);

  return (
    <nav
      className={['ges-nav', className].filter(Boolean).join(' ')}
      onMouseLeave={() => setOpenId(null)}
    >
      <ul className="ges-nav__top">
        {tree.map((item) => {
          const hasKids = (item.children?.length ?? 0) > 0;

          return (
            <li
              key={item.entityId}
              className="ges-nav__top-item"
              onMouseEnter={() => setOpenId(item.entityId)}
            >
              <Link className="ges-nav__top-link" href={categoryHref(item.path)}>
                {item.name}
                {hasKids && <span className="ges-nav__caret">▾</span>}
              </Link>

              {hasKids && openId === item.entityId && (
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
    </nav>
  );
}
