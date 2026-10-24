'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Actions,
  DesktopMenu,
  Logo,
  type MenuNode,
  MobileMenu,
  type Props as ShowHeaderProps,
  type StaticItem,
} from '../ges-show-header/client';

// Header whose commerce menu comes from the Show App (/api/showapp/nav-tree): the show's categories with its
// display names, hidden categories, CMS links, new tab and date windows already applied. Same look as the
// "Show Header (API + delta)" component, without the Makeswift deltas (those now live in the Show App).

interface ShowAppNode {
  entityId: number;
  name: string;
  path: string;
  newTab?: boolean;
  children?: ShowAppNode[];
}

type Props = Pick<ShowHeaderProps, 'className' | 'logo' | 'staticItems' | 'appearance' | 'actions' | 'scrollBehavior'> & {
  show?: { projectNumber?: string };
};

// Level 3 and below become the links of their level-2 column (the menu has three levels).
const descendants = (nodes: ShowAppNode[] = []): ShowAppNode[] => nodes.flatMap((n) => [n, ...descendants(n.children)]);

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

export function GesShowAppHeaderClient({ className, logo = {}, staticItems, appearance = {}, actions = {}, scrollBehavior = 'static', show = {} }: Props) {
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
    // Order and names come from the Show App as is (BC order, display names applied).
    const showNodes: MenuNode[] = tree.map((root, apiIndex) => ({
      key: `showapp-${root.entityId}`,
      label: root.name,
      href: root.path,
      newTab: root.newTab,
      source: 'api',
      apiIndex,
      columns: (root.children ?? []).map((child) => ({
        label: child.name,
        href: child.path,
        newTab: child.newTab,
        links: descendants(child.children).map((leaf) => ({ label: leaf.name, href: leaf.path, newTab: leaf.newTab })),
      })),
    }));

    const items = (staticItems ?? []).map((item, index) => ({ item, index }));
    const before = items.filter(({ item }) => item.position === 'before').map(({ item, index }) => mapStatic(item, index));
    const after = items.filter(({ item }) => item.position !== 'before').map(({ item, index }) => mapStatic(item, index));

    return [...before, ...showNodes, ...after];
  }, [staticItems, tree]);

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
