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
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredL2Id, setHoveredL2Id] = useState<number | null>(null);
  const [hoveredManualL2, setHoveredManualL2] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'manual') return;

    let cancelled = false;
    const url =
      mode === 'auto-featured' ? '/api/bc/nav-tree?filter=featured' : '/api/bc/nav-tree';

    setStatus('loading');
    fetch(url)
      .then(async (r) => {
        const data = await r.json();

        if (cancelled) return;

        if (!r.ok || data?.error) {
          setStatus('error');
          setErrorMsg(data?.error || `HTTP ${r.status}`);
          setTree([]);

          return;
        }

        setTree(data.tree ?? []);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(String(err));
        setTree([]);
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const renderAuto = () => (
    <ul className="ges-nav__top">
      {tree.map((item) => {
        const l2s = item.children ?? [];
        const hasKids = l2s.length > 0;
        const key = `api-${item.entityId}`;
        const activeL2 = l2s.find((c) => c.entityId === hoveredL2Id) ?? l2s[0];
        const l3s = activeL2?.children ?? [];

        return (
          <li
            key={item.entityId}
            className="ges-nav__top-item"
            onMouseEnter={() => {
              setOpenId(key);
              setHoveredL2Id(l2s[0]?.entityId ?? null);
            }}
          >
            <Link className="ges-nav__top-link" href={categoryHref(item.path)}>
              {item.name}
              {hasKids && <span className="ges-nav__caret">▾</span>}
            </Link>

            {hasKids && openId === key && (
              <div className="ges-nav__cascade">
                <div className="ges-nav__pane ges-nav__pane--l2">
                  <div className="ges-nav__pane-label">Categories</div>
                  <ul className="ges-nav__pane-list">
                    {l2s.map((l2) => {
                      const active = l2.entityId === (activeL2?.entityId ?? -1);

                      return (
                        <li
                          key={l2.entityId}
                          className={[
                            'ges-nav__pane-item',
                            active ? 'ges-nav__pane-item--active' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onMouseEnter={() => setHoveredL2Id(l2.entityId)}
                        >
                          <Link className="ges-nav__pane-link" href={categoryHref(l2.path)}>
                            {l2.name}
                            {(l2.children?.length ?? 0) > 0 && (
                              <span className="ges-nav__pane-chev">›</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {l3s.length > 0 && (
                  <div className="ges-nav__pane ges-nav__pane--l3">
                    <div className="ges-nav__pane-label">{activeL2?.name}</div>
                    <ul className="ges-nav__pane-list">
                      {l3s.map((l3) => (
                        <li key={l3.entityId} className="ges-nav__pane-item">
                          <Link className="ges-nav__pane-link" href={categoryHref(l3.path)}>
                            {l3.name}
                          </Link>
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
