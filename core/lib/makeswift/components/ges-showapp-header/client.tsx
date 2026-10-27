'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Actions,
  type CategoryAddition,
  type CategoryOverride,
  DesktopMenu,
  getCategoryId,
  Logo,
  type MenuNode,
  MobileMenu,
  type Props as ShowHeaderProps,
  type StaticItem,
} from '../ges-show-header/client';

// Header whose commerce menu comes from the Show App (/api/showapp/nav-tree): the show's categories with its
// display names, hidden categories, CMS links, new tab and date windows already applied. Same look as the
// "Show Header (API + delta)" component, and the same Makeswift deltas on top (rename, hide, reorder, add links).

interface ShowAppNode {
  entityId: number;
  name: string;
  path: string;
  newTab?: boolean;
  children?: ShowAppNode[];
}

interface DeltaNode {
  key: string;
  label: string;
  href: string;
  newTab?: boolean;
  children: DeltaNode[];
}

type Props = Pick<ShowHeaderProps, 'className' | 'logo' | 'catalog' | 'staticItems' | 'appearance' | 'actions' | 'scrollBehavior'> & {
  show?: { projectNumber?: string };
};

const sortKey = (order: number | undefined, fallback: number) => (order && order > 0 ? order : 10_000 + fallback);

// Show App tree + Makeswift delta: hidden categories drop with their subtree, renames and orders apply at any
// level, added links go last under their parent unless given an order.
function applyDelta(
  items: ShowAppNode[],
  overrides: Map<number, CategoryOverride>,
  additions: Map<number, CategoryAddition[]>,
  parentId?: number,
): DeltaNode[] {
  const categories = items.flatMap((item, index) => {
    const delta = overrides.get(item.entityId);
    if (delta?.hide) return [];

    return [
      {
        sort: sortKey(delta?.order, index),
        node: {
          key: `showapp-${item.entityId}`,
          label: delta?.renameLabel?.trim() || item.name,
          href: item.path,
          newTab: item.newTab,
          children: applyDelta(item.children ?? [], overrides, additions, item.entityId),
        },
      },
    ];
  });
  const added = (parentId ? (additions.get(parentId) ?? []) : []).map((addition, index) => ({
    sort: sortKey(addition.order, items.length + index),
    node: { key: `added-${parentId}-${index}`, label: addition.label!.trim(), href: addition.href?.trim() || '#', children: [] },
  }));

  return [...categories, ...added].sort((left, right) => left.sort - right.sort).map(({ node }) => node);
}

// Level 3 and below become the links of their level-2 column (the menu has three levels).
const descendants = (nodes: DeltaNode[] = []): DeltaNode[] => nodes.flatMap((n) => [n, ...descendants(n.children)]);

const mapStatic = (item: StaticItem, index: number): MenuNode => ({
  key: `static-${index}`,
  label: item.label || 'Page',
  href: item.href || undefined,
  source: 'makeswift',
  apiIndex: index,
  columns: (item.groups ?? []).map((group) => ({
    label: group.label || 'Pages',
    href: group.href || undefined,
    links: (group.links ?? [])
      .filter((link) => link.label?.trim())
      .map((link) => ({ label: link.label!, href: link.href || '#', newTab: link.newTab })),
  })),
});

export function GesShowAppHeaderClient({ className, logo = {}, catalog = {}, staticItems, appearance = {}, actions = {}, scrollBehavior = 'static', show = {} }: Props) {
  const [tree, setTree] = useState<ShowAppNode[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const projectNumber = show.projectNumber?.trim() ?? '';

  useEffect(() => {
    const controller = new AbortController();
    const query = projectNumber ? `?${new URLSearchParams({ project: projectNumber })}` : '';

    setStatus('loading');
    fetch(`/api/showapp/nav-tree${query}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || data?.error) throw new Error(data?.error || 'Navigation request failed');
        setTree(data.tree ?? []);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setTree([]);
        setStatus('error');
      });

    return () => controller.abort();
  }, [projectNumber]);

  const nodes = useMemo(() => {
    // Show App order and names (BC order, display names applied), then the Makeswift delta.
    const overrides = new Map<number, CategoryOverride>();
    catalog.overrides?.forEach((override) => {
      const id = getCategoryId(override.matchId);
      if (id) overrides.set(id, override);
    });
    const additions = new Map<number, CategoryAddition[]>();
    catalog.additions?.forEach((addition) => {
      const parentId = getCategoryId(addition.parentId);
      if (!parentId || !addition.label?.trim()) return;
      additions.set(parentId, [...(additions.get(parentId) ?? []), addition]);
    });

    const showNodes: MenuNode[] = applyDelta(tree, overrides, additions).map((root, apiIndex) => ({
      key: root.key,
      label: root.label,
      href: root.href,
      newTab: root.newTab,
      source: 'api',
      apiIndex,
      columns: root.children.map((child) => ({
        label: child.label,
        href: child.href,
        newTab: child.newTab,
        links: descendants(child.children).map((leaf) => ({ label: leaf.label, href: leaf.href, newTab: leaf.newTab })),
      })),
    }));

    const items = (staticItems ?? []).map((item, index) => ({ item, index }));
    const before = items.filter(({ item }) => item.position === 'before').map(({ item, index }) => mapStatic(item, index));
    const after = items.filter(({ item }) => item.position !== 'before').map(({ item, index }) => mapStatic(item, index));

    return [...before, ...showNodes, ...after];
  }, [catalog.additions, catalog.overrides, staticItems, tree]);

  const effectiveActions = {
    showLocale: actions.showLocale ?? true,
    showAccount: actions.showAccount ?? true,
    showBooth: actions.showBooth ?? true,
    showContact: actions.showContact ?? true,
    showCart: actions.showCart ?? true,
    showSearch: actions.showSearch ?? true,
    ...actions,
  };

  return (
    <div className={['ges-eval-header', scrollBehavior === 'sticky' ? 'ges-eval-header--sticky' : '', className].filter(Boolean).join(' ')}>
      <header style={{ backgroundColor: appearance.backgroundColor || '#ffffff' }}>
        <div className="ges-eval-header__utility">
          <Actions actions={{ ...effectiveActions, showBooth: false, showCart: false, showSearch: false }} />
        </div>
        <div className="ges-eval-header__main">
          <Logo {...logo} />
          <DesktopMenu nodes={nodes} />
          <div className="ges-eval-header__main-actions">
            <Actions actions={{ ...effectiveActions, showLocale: false, showAccount: false, showContact: false }} />
          </div>
          <MobileMenu actions={effectiveActions} nodes={nodes} />
        </div>
        <div aria-live="polite" className="ges-eval-header__source-status">
          {status === 'loading' && 'Loading navigation…'}
          {status === 'error' && 'Static navigation only — Show App unavailable'}
          {status === 'ready' && tree.length === 0 && 'No categories for this show'}
        </div>
      </header>
    </div>
  );
}
