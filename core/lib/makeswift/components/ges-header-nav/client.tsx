'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

interface ExtraLeaf {
  label?: string;
  href?: string;
}

interface Override {
  matchId?: number;
  hide?: boolean;
  renameLabel?: string;
  extraChildren?: ExtraLeaf[];
}

interface ExtraColumn {
  label?: string;
  href?: string;
  links?: ExtraLeaf[];
}

interface ExtraItem {
  label?: string;
  href?: string;
  position?: 'append' | 'prepend';
  groups?: ExtraColumn[];
}

type Mode = 'auto-featured' | 'auto-all';

interface Props {
  className?: string;
  mode?: Mode;
  overrides?: Override[];
  extraItems?: ExtraItem[];
}

type RenderNode =
  | {
      kind: 'bc';
      key: string;
      label: string;
      href?: string;
      columns: Array<{
        label: string;
        href?: string;
        links: Array<{ label: string; href: string }>;
      }>;
    }
  | {
      kind: 'extra';
      key: string;
      label: string;
      href?: string;
      columns: Array<{
        label: string;
        href?: string;
        links: Array<{ label: string; href: string }>;
      }>;
    };

function categoryHref(path: string) {
  return `/category${path.startsWith('/') ? path : `/${path}`}`;
}

export function GesHeaderNavClient({
  className,
  mode = 'auto-featured',
  overrides,
  extraItems,
}: Props) {
  const [tree, setTree] = useState<L1[]>([]);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [hoveredColIdx, setHoveredColIdx] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    const url =
      mode === 'auto-featured' ? '/api/bc/nav-tree?filter=featured' : '/api/bc/nav-tree';

    fetch(url)
      .then(async (r) => {
        const data = await r.json();

        if (cancelled) return;
        if (!r.ok || data?.error) {
          setTree([]);

          return;
        }

        setTree(data.tree ?? []);
      })
      .catch(() => {
        if (!cancelled) setTree([]);
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const overrideMap = useMemo(() => {
    const m = new Map<number, Override>();

    (overrides ?? []).forEach((o) => {
      if (typeof o.matchId === 'number' && o.matchId > 0) m.set(o.matchId, o);
    });

    return m;
  }, [overrides]);

  const nodes: RenderNode[] = useMemo(() => {
    type Column = RenderNode['columns'][number];

    const bcNodes: RenderNode[] = [];

    tree.forEach((root) => {
      const ov = overrideMap.get(root.entityId);

      if (ov?.hide) return;

      const label = ov?.renameLabel?.trim() || root.name;
      const l2s = root.children ?? [];

      const columns: Column[] = l2s.map((l2) => ({
        label: l2.name,
        href: categoryHref(l2.path),
        links: (l2.children ?? []).map((l3) => ({
          label: l3.name,
          href: categoryHref(l3.path),
        })),
      }));

      const extraChildren = (ov?.extraChildren ?? [])
        .filter((c) => (c.label ?? '').trim().length > 0)
        .map((c) => ({ label: c.label ?? '', href: c.href ?? '#' }));

      if (extraChildren.length > 0) {
        columns.push({ label: 'More', links: extraChildren });
      }

      bcNodes.push({
        kind: 'bc',
        key: `bc-${root.entityId}`,
        label,
        href: categoryHref(root.path),
        columns,
      });
    });

    const mapExtra = (ei: ExtraItem, i: number): RenderNode => ({
      kind: 'extra',
      key: `extra-${i}`,
      label: ei.label ?? 'Item',
      href: ei.href || undefined,
      columns: (ei.groups ?? []).map((col) => ({
        label: col.label ?? '',
        href: col.href || undefined,
        links: (col.links ?? [])
          .filter((l) => (l.label ?? '').trim().length > 0)
          .map((l) => ({ label: l.label ?? '', href: l.href ?? '#' })),
      })),
    });

    const prepend = (extraItems ?? [])
      .map((ei, i) => ({ ei, i }))
      .filter(({ ei }) => ei.position === 'prepend')
      .map(({ ei, i }) => mapExtra(ei, i));

    const append = (extraItems ?? [])
      .map((ei, i) => ({ ei, i }))
      .filter(({ ei }) => ei.position !== 'prepend')
      .map(({ ei, i }) => mapExtra(ei, i));

    return [...prepend, ...bcNodes, ...append];
  }, [tree, overrideMap, extraItems]);

  const activeNode = openKey ? nodes.find((n) => n.key === openKey) : null;
  const columns = activeNode?.columns ?? [];
  const activeCol = columns[hoveredColIdx] ?? columns[0];
  const activeLinks = activeCol?.links ?? [];

  return (
    <nav
      className={['ges-nav', className].filter(Boolean).join(' ')}
      onMouseLeave={() => {
        setOpenKey(null);
        setHoveredColIdx(0);
      }}
    >
      <ul className="ges-nav__top">
        {nodes.map((node) => {
          const hasKids = node.columns.length > 0;

          return (
            <li
              key={node.key}
              className="ges-nav__top-item"
              onMouseEnter={() => {
                setOpenKey(node.key);
                setHoveredColIdx(0);
              }}
            >
              {node.href ? (
                <Link className="ges-nav__top-link" href={node.href}>
                  {node.label}
                  {hasKids && <span className="ges-nav__caret">▾</span>}
                </Link>
              ) : (
                <span className="ges-nav__top-link">
                  {node.label}
                  {hasKids && <span className="ges-nav__caret">▾</span>}
                </span>
              )}

              {hasKids && openKey === node.key && (
                <div className="ges-nav__cascade">
                  <div className="ges-nav__pane ges-nav__pane--l2">
                    <div className="ges-nav__pane-label">
                      {node.kind === 'bc' ? 'Categories' : 'Sections'}
                    </div>
                    <ul className="ges-nav__pane-list">
                      {columns.map((col, j) => {
                        const isActive = j === hoveredColIdx;

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
                                {col.links.length > 0 && (
                                  <span className="ges-nav__pane-chev">›</span>
                                )}
                              </Link>
                            ) : (
                              <span className="ges-nav__pane-link">
                                {col.label}
                                {col.links.length > 0 && (
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
                            <Link className="ges-nav__pane-link" href={leaf.href}>
                              {leaf.label}
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
    </nav>
  );
}
