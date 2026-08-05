'use client';

import { ChevronDown, ChevronRight, Languages, Menu, Search, ShoppingCart, Store, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import styles from './styles.module.css';

interface CategoryNode {
  entityId: number;
  name: string;
  path: string;
  children?: CategoryNode[];
}

interface CategoryOverride {
  matchId?: number | string | { value?: string };
  hide?: boolean;
  renameLabel?: string;
  order?: number;
}

interface CategoryAddition {
  parentId?: number | string | { value?: string };
  label?: string;
  href?: string;
  order?: number;
}

interface StaticLink {
  label?: string;
  href?: string;
  newTab?: boolean;
}

interface StaticGroup {
  label?: string;
  href?: string;
  links?: StaticLink[];
}

interface StaticItem {
  label?: string;
  href?: string;
  position?: 'before' | 'after';
  groups?: StaticGroup[];
}

interface MenuColumn {
  label: string;
  href?: string;
  links: Array<{ label: string; href: string; newTab?: boolean }>;
}

interface MenuNode {
  key: string;
  label: string;
  href?: string;
  columns: MenuColumn[];
  source: 'api' | 'makeswift' | 'demo';
  order?: number;
  apiIndex: number;
}

interface Props {
  className?: string;
  logo?: { source?: 'default' | 'custom'; image?: string; alt?: string; text?: string; href?: string };
  catalog?: {
    overrides?: CategoryOverride[];
    additions?: CategoryAddition[];
  };
  staticItems?: StaticItem[];
  appearance?: { backgroundColor?: string };
  layout?: { overflowMode?: 'automatic' | 'show-all'; overflowLabel?: string };
  actions?: {
    showLocale?: boolean;
    showAccount?: boolean;
    showBooth?: boolean;
    showContact?: boolean;
    showCart?: boolean;
    showSearch?: boolean;
    localeLabel?: string;
    accountLabel?: string;
    accountHref?: string;
    boothLabel?: string;
    boothHref?: string;
    contactLabel?: string;
    contactHref?: string;
    cartHref?: string;
    demoCartCount?: number;
  };
  demoBrand?: { showBrand?: boolean; brandLabel?: string; brandHref?: string };
  scrollBehavior?: 'static' | 'sticky';
}

const categoryHref = (path: string) => `/category${path.startsWith('/') ? path : `/${path}`}`;
const getCategoryId = (value: CategoryOverride['matchId'] | CategoryAddition['parentId']) => {
  const rawValue = typeof value === 'object' ? value?.value : value;
  const parsed = Number(rawValue);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

function Logo({ source = 'default', image, alt = 'GES', text = 'GES', href = '/' }: NonNullable<Props['logo']>) {
  const effectiveImage = source === 'default' ? '/ges-logo.svg' : image;

  return (
    <Link aria-label="Home" className="ges-eval-header__logo" href={href}>
      {effectiveImage ? <img alt={alt} src={effectiveImage} /> : <span className="ges-eval-header__logo-mark">✦</span>}
      {!effectiveImage && <strong>{text}</strong>}
    </Link>
  );
}

function OverflowMenu({ label, nodes }: { label: string; nodes: MenuNode[] }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeNode = nodes[activeIndex] ?? nodes[0];

  return (
    <li className={styles.overflowItem} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className="ges-eval-header__top-link-row">
        <button aria-expanded={open} className="ges-eval-header__top-link" onClick={() => setOpen((current) => !current)} type="button">
          {label} <ChevronDown aria-hidden size={15} />
        </button>
      </div>
      {open && activeNode && (
        <div className="ges-eval-header__mega-menu">
          <div className="ges-eval-header__mega-list">
            <div className="ges-eval-header__eyebrow">More navigation</div>
            {nodes.map((node, index) => (
              <button className={index === activeIndex ? 'is-active' : ''} key={node.key} onFocus={() => setActiveIndex(index)} onMouseEnter={() => setActiveIndex(index)} type="button">
                <span>{node.label}</span>
                <ChevronRight aria-hidden size={16} />
              </button>
            ))}
          </div>
          <div className="ges-eval-header__mega-detail">
            <div className="ges-eval-header__eyebrow">{activeNode.label}</div>
            {activeNode.href && <Link href={activeNode.href}>View all {activeNode.label}</Link>}
            {activeNode.columns.map((column) => (
              <div className={styles.overflowGroup} key={`${activeNode.key}-${column.label}`}>
                {column.href ? <Link href={column.href}>{column.label}</Link> : <strong>{column.label}</strong>}
                {column.links.map((link) => (
                  <Link href={link.href} key={`${column.label}-${link.label}-${link.href}`} rel={link.newTab ? 'noopener noreferrer' : undefined} target={link.newTab ? '_blank' : undefined}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

function DesktopMenu({ nodes, overflowLabel = 'More', overflowMode = 'automatic' }: { nodes: MenuNode[]; overflowLabel?: string; overflowMode?: 'automatic' | 'show-all' }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState(0);
  const [visibleCount, setVisibleCount] = useState(nodes.length);
  const navRef = useRef<HTMLElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (overflowMode === 'show-all') {
      setVisibleCount(nodes.length);
      return;
    }

    const nav = navRef.current;
    const measurement = measurementRef.current;
    if (!nav || !measurement) return;

    const measure = () => {
      const itemWidths = Array.from(measurement.querySelectorAll<HTMLElement>('[data-menu-item]')).map((item) => item.offsetWidth + 2);
      const moreWidth = measurement.querySelector<HTMLElement>('[data-more-item]')?.offsetWidth ?? 72;
      const available = nav.clientWidth;
      const total = itemWidths.reduce((sum, width) => sum + width, 0);

      if (total <= available) {
        setVisibleCount(nodes.length);
        return;
      }

      const budget = Math.max(0, available - moreWidth);
      let used = 0;
      let nextVisibleCount = 0;
      for (const width of itemWidths) {
        if (used + width > budget) break;
        used += width;
        nextVisibleCount += 1;
      }
      setVisibleCount(nextVisibleCount);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    void document.fonts?.ready.then(measure);
    measure();

    return () => observer.disconnect();
  }, [nodes, overflowLabel, overflowMode]);

  const effectiveVisibleCount = overflowMode === 'show-all' ? nodes.length : Math.min(visibleCount, nodes.length);
  const visibleNodes = nodes.slice(0, effectiveVisibleCount);
  const overflowNodes = nodes.slice(effectiveVisibleCount);

  return (
    <nav aria-label="Primary navigation" className={`ges-eval-header__desktop-nav ${styles.desktopNav}`} ref={navRef}>
      <div aria-hidden className={styles.measurement} ref={measurementRef}>
        {nodes.map((node) => (
          <span data-menu-item key={node.key}>{node.label}<ChevronDown size={15} /></span>
        ))}
        <span data-more-item>{overflowLabel}<ChevronDown size={15} /></span>
      </div>
      <ul>
        {visibleNodes.map((node) => {
          const open = node.key === openKey;
          const hasChildren = node.columns.length > 0;
          const column = node.columns[activeColumn] ?? node.columns[0];

          return (
            <li
              key={node.key}
              onMouseEnter={() => {
                setOpenKey(node.key);
                setActiveColumn(0);
              }}
              onMouseLeave={() => setOpenKey(null)}
            >
              <div className="ges-eval-header__top-link-row">
                <Link className="ges-eval-header__top-link" href={node.href ?? '#'}>
                  {node.label}
                </Link>
                {hasChildren && (
                  <button aria-expanded={open} aria-label={`Open ${node.label} menu`} onClick={() => setOpenKey(open ? null : node.key)} type="button">
                    <ChevronDown aria-hidden size={15} />
                  </button>
                )}
              </div>

              {hasChildren && open && (
                <div className="ges-eval-header__mega-menu">
                  <div className="ges-eval-header__mega-list">
                    <div className="ges-eval-header__eyebrow">{node.source === 'api' ? 'Eligible categories' : 'Pages'}</div>
                    {node.columns.map((item, index) => (
                      <button className={index === activeColumn ? 'is-active' : ''} key={`${node.key}-${item.label}-${index}`} onMouseEnter={() => setActiveColumn(index)} onFocus={() => setActiveColumn(index)} type="button">
                        <span>{item.label}</span>
                        {item.links.length > 0 && <ChevronRight aria-hidden size={16} />}
                      </button>
                    ))}
                  </div>
                  <div className="ges-eval-header__mega-detail">
                    <div className="ges-eval-header__eyebrow">{column?.label}</div>
                    {column?.href && <Link href={column.href}>View all {column.label}</Link>}
                    {column?.links.map((link) => (
                      <Link href={link.href} key={`${column.label}-${link.label}-${link.href}`} rel={link.newTab ? 'noopener noreferrer' : undefined} target={link.newTab ? '_blank' : undefined}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
        {overflowNodes.length > 0 && <OverflowMenu label={overflowLabel} nodes={overflowNodes} />}
      </ul>
    </nav>
  );
}

function Actions({ actions, mobile = false }: { actions: NonNullable<Props['actions']>; mobile?: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const actionClass = mobile ? 'ges-eval-header__mobile-action' : 'ges-eval-header__utility-link';

  return (
    <>
      {actions.showLocale && (
        <button className={actionClass} type="button">
          <Languages aria-hidden size={16} /> {actions.localeLabel || 'EN'}
        </button>
      )}
      {actions.showAccount && (
        <Link className={actionClass} href={actions.accountHref || '/login'}>
          <UserRound aria-hidden size={16} /> {actions.accountLabel || 'Account'}
        </Link>
      )}
      {actions.showContact && (
        <Link className={actionClass} href={actions.contactHref || '/contact-us'}>
          {actions.contactLabel || 'Contact Us'}
        </Link>
      )}
      {actions.showBooth && (
        <Link className={`${actionClass} ges-eval-header__booth`} href={actions.boothHref || '/account/shows'}>
          <Store aria-hidden size={18} /> {actions.boothLabel || 'Find or Add Your Booth'}
        </Link>
      )}
      {actions.showCart && (
        <Link aria-label="Cart" className={`${actionClass} ges-eval-header__cart`} href={actions.cartHref || '/cart'}>
          <ShoppingCart aria-hidden size={18} />
          {(actions.demoCartCount ?? 0) > 0 && <span>{actions.demoCartCount}</span>}
        </Link>
      )}
      {actions.showSearch && (
        <button aria-expanded={searchOpen} aria-label="Search" className={actionClass} onClick={() => setSearchOpen((current) => !current)} type="button">
          <Search aria-hidden size={18} />
        </button>
      )}
      {searchOpen && (
        <form action="/search" className="ges-eval-header__search" role="search">
          <label htmlFor="ges-header-search">Search products</label>
          <div>
            <input autoFocus id="ges-header-search" name="term" placeholder="Search products" />
            <button type="submit">
              <Search aria-hidden size={18} />
              <span className="sr-only">Submit search</span>
            </button>
          </div>
        </form>
      )}
    </>
  );
}

function MobileMenu({ nodes, actions }: { nodes: MenuNode[]; actions: NonNullable<Props['actions']> }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);

  return (
    <div className="ges-eval-header__mobile">
      <button aria-expanded={open} aria-label="Open navigation" onClick={() => setOpen(true)} type="button">
        <Menu aria-hidden size={25} />
      </button>
      {open && (
        <div className="ges-eval-header__mobile-overlay">
          <button aria-label="Close navigation" className="ges-eval-header__mobile-backdrop" onClick={() => setOpen(false)} type="button" />
          <aside aria-label="Mobile navigation">
            <div className="ges-eval-header__mobile-title">
              <strong>Menu</strong>
              <button aria-label="Close navigation" onClick={() => setOpen(false)} type="button">
                <X aria-hidden />
              </button>
            </div>
            <nav>
              {nodes.map((node) => (
                <div className="ges-eval-header__mobile-node" key={node.key}>
                  <div>
                    <Link href={node.href || '#'} onClick={() => setOpen(false)}>
                      {node.label}
                    </Link>
                    {node.columns.length > 0 && (
                      <button aria-expanded={expanded === node.key} aria-label={`Expand ${node.label}`} onClick={() => setExpanded(expanded === node.key ? null : node.key)} type="button">
                        <ChevronDown aria-hidden size={18} />
                      </button>
                    )}
                  </div>
                  {expanded === node.key && (
                    <div className="ges-eval-header__mobile-children">
                      {node.columns.map((column) => (
                        <div key={`${node.key}-${column.label}`}>
                          {column.href ? <Link href={column.href}>{column.label}</Link> : <strong>{column.label}</strong>}
                          {column.links.map((link) => (
                            <Link href={link.href} key={`${column.label}-${link.label}`}>
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="ges-eval-header__mobile-actions">
              <Actions actions={actions} mobile />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export function GesShowHeaderClient({ className, logo = {}, catalog = {}, staticItems, appearance = {}, layout = {}, actions = {}, demoBrand = {}, scrollBehavior = 'static' }: Props) {
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/bc/nav-tree?filter=featured&featuredFirst=50', {
      signal: controller.signal,
    })
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
  }, []);

  const nodes = useMemo(() => {
    const overrideMap = new Map<number, CategoryOverride>();
    catalog.overrides?.forEach((override) => {
      const id = getCategoryId(override.matchId);
      if (id) overrideMap.set(id, override);
    });
    const additionsByParent = new Map<number, CategoryAddition[]>();
    catalog.additions?.forEach((addition) => {
      const parentId = getCategoryId(addition.parentId);
      if (!parentId || !addition.label?.trim()) return;
      additionsByParent.set(parentId, [...(additionsByParent.get(parentId) ?? []), addition]);
    });

    const getOrder = (order: number | undefined, fallback: number) => (order && order > 0 ? order : 10_000 + fallback);
    const visibleCategories = (categories: CategoryNode[]) =>
      categories
        .map((category, apiIndex) => ({ category, apiIndex, delta: overrideMap.get(category.entityId) }))
        .filter(({ delta }) => !delta?.hide)
        .sort((left, right) => getOrder(left.delta?.order, left.apiIndex) - getOrder(right.delta?.order, right.apiIndex));

    const apiNodes: MenuNode[] = visibleCategories(tree)
      .map(({ category: root, apiIndex, delta }): MenuNode => {
        const childColumns = visibleCategories(root.children ?? []).map(({ category: child, apiIndex: childIndex, delta: childDelta }) => {
          const leafLinks = visibleCategories(child.children ?? []).map(({ category: leaf, delta: leafDelta }) => ({
            label: leafDelta?.renameLabel?.trim() || leaf.name,
            href: categoryHref(leaf.path),
            order: leafDelta?.order,
          }));
          const addedLeafLinks = (additionsByParent.get(child.entityId) ?? []).map((addition) => ({
            label: addition.label!.trim(),
            href: addition.href?.trim() || '#',
            order: addition.order,
          }));
          const links = [...leafLinks.map((link, index) => ({ ...link, sort: getOrder(link.order, index) })), ...addedLeafLinks.map((link, index) => ({ ...link, sort: getOrder(link.order, leafLinks.length + index) }))]
            .sort((left, right) => left.sort - right.sort)
            .map(({ label, href }) => ({ label, href }));

          return {
            label: childDelta?.renameLabel?.trim() || child.name,
            href: categoryHref(child.path),
            links,
            sort: getOrder(childDelta?.order, childIndex),
          };
        });
        const addedChildColumns = (additionsByParent.get(root.entityId) ?? []).map((addition, additionIndex) => ({
          label: addition.label!.trim(),
          href: addition.href?.trim() || '#',
          links: [],
          sort: getOrder(addition.order, childColumns.length + additionIndex),
        }));

        return {
          key: `api-${root.entityId}`,
          label: delta?.renameLabel?.trim() || root.name,
          href: categoryHref(root.path),
          source: 'api',
          order: delta?.order,
          apiIndex,
          columns: [...childColumns, ...addedChildColumns]
            .sort((left, right) => left.sort - right.sort)
            .map((column) => ({ label: column.label, href: column.href, links: column.links })),
        };
      })
      .sort((left, right) => {
        const leftOrder = left.order && left.order > 0 ? left.order : 10_000 + left.apiIndex;
        const rightOrder = right.order && right.order > 0 ? right.order : 10_000 + right.apiIndex;
        return leftOrder - rightOrder;
      });

    const defaults: StaticItem[] = staticItems?.length
      ? staticItems
      : [
          {
            label: 'Show Information',
            position: 'after',
            groups: [
              {
                label: 'Plan your show',
                links: [
                  { label: 'Quick Facts', href: '/quick-facts' },
                  { label: 'Important Dates', href: '/important-dates' },
                  { label: 'Contact Us', href: '/contact-us' },
                ],
              },
            ],
          },
        ];

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
          .map((link) => ({
            label: link.label!,
            href: link.href || '#',
            newTab: link.newTab,
          })),
      })),
    });

    const before = defaults
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.position === 'before')
      .map(({ item, index }) => mapStatic(item, index));
    const after = defaults
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.position !== 'before')
      .map(({ item, index }) => mapStatic(item, index));
    const brand: MenuNode[] = demoBrand.showBrand
      ? [
          {
            key: 'demo-brand',
            label: demoBrand.brandLabel || 'GES Collections',
            href: demoBrand.brandHref || '/brands',
            columns: [],
            source: 'demo',
            apiIndex: 0,
          },
        ]
      : [];

    return [...before, ...apiNodes, ...brand, ...after];
  }, [catalog.additions, catalog.overrides, demoBrand, staticItems, tree]);

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
          <Actions
            actions={{
              ...effectiveActions,
              showBooth: false,
              showCart: false,
              showSearch: false,
            }}
          />
        </div>
        <div className="ges-eval-header__main">
          <Logo {...logo} />
          <DesktopMenu nodes={nodes} overflowLabel={layout.overflowLabel} overflowMode={layout.overflowMode} />
          <div className="ges-eval-header__main-actions">
            <Actions
              actions={{
                ...effectiveActions,
                showLocale: false,
                showAccount: false,
                showContact: false,
              }}
            />
          </div>
          <MobileMenu actions={effectiveActions} nodes={nodes} />
        </div>
        <div aria-live="polite" className="ges-eval-header__source-status">
          {status === 'loading' && 'Loading navigation…'}
          {status === 'error' && 'Static navigation only — catalog unavailable'}
          {status === 'ready' && tree.length === 0 && 'No eligible product categories'}
        </div>
      </header>
    </div>
  );
}
