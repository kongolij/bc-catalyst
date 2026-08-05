'use client';

import {
  ChevronDown,
  ChevronRight,
  Languages,
  Menu,
  Search,
  ShoppingCart,
  Store,
  UserRound,
  X,
} from 'lucide-react';
import { useIsInBuilder } from '@makeswift/runtime/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface CategoryNode {
  entityId: number;
  name: string;
  path: string;
  children?: CategoryNode[];
}

interface CategoryOverride {
  matchId?: number;
  hide?: boolean;
  renameLabel?: string;
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
  logo?: { image?: string; alt?: string; text?: string; href?: string };
  catalog?: {
    featuredLimit?: number;
    loadingLabel?: string;
    emptyLabel?: string;
    overrides?: CategoryOverride[];
  };
  staticItems?: StaticItem[];
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

function Logo({ image, alt = 'GES', text = 'GES', href = '/' }: NonNullable<Props['logo']>) {
  return (
    <Link aria-label="Home" className="ges-eval-header__logo" href={href}>
      {image ? <img alt={alt} src={image} /> : <span className="ges-eval-header__logo-mark">✦</span>}
      {!image && <strong>{text}</strong>}
    </Link>
  );
}

function DesktopMenu({ nodes }: { nodes: MenuNode[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState(0);

  return (
    <nav aria-label="Primary navigation" className="ges-eval-header__desktop-nav">
      <ul>
        {nodes.map((node) => {
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
                  <button
                    aria-expanded={open}
                    aria-label={`Open ${node.label} menu`}
                    onClick={() => setOpenKey(open ? null : node.key)}
                    type="button"
                  >
                    <ChevronDown aria-hidden size={15} />
                  </button>
                )}
              </div>

              {hasChildren && open && (
                <div className="ges-eval-header__mega-menu">
                  <div className="ges-eval-header__mega-list">
                    <div className="ges-eval-header__eyebrow">
                      {node.source === 'api' ? 'Eligible categories' : 'Pages'}
                    </div>
                    {node.columns.map((item, index) => (
                      <button
                        className={index === activeColumn ? 'is-active' : ''}
                        key={`${node.key}-${item.label}-${index}`}
                        onMouseEnter={() => setActiveColumn(index)}
                        onFocus={() => setActiveColumn(index)}
                        type="button"
                      >
                        <span>{item.label}</span>
                        {item.links.length > 0 && <ChevronRight aria-hidden size={16} />}
                      </button>
                    ))}
                  </div>
                  <div className="ges-eval-header__mega-detail">
                    <div className="ges-eval-header__eyebrow">{column?.label}</div>
                    {column?.href && <Link href={column.href}>View all {column.label}</Link>}
                    {column?.links.map((link) => (
                      <Link
                        href={link.href}
                        key={`${column.label}-${link.label}-${link.href}`}
                        rel={link.newTab ? 'noopener noreferrer' : undefined}
                        target={link.newTab ? '_blank' : undefined}
                      >
                        {link.label}
                      </Link>
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
        <button
          aria-expanded={searchOpen}
          aria-label="Search"
          className={actionClass}
          onClick={() => setSearchOpen((current) => !current)}
          type="button"
        >
          <Search aria-hidden size={18} />
        </button>
      )}
      {searchOpen && (
        <form action="/search" className="ges-eval-header__search" role="search">
          <label htmlFor="ges-header-search">Search products</label>
          <div>
            <input autoFocus id="ges-header-search" name="term" placeholder="Search products" />
            <button type="submit"><Search aria-hidden size={18} /><span className="sr-only">Submit search</span></button>
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
              <button aria-label="Close navigation" onClick={() => setOpen(false)} type="button"><X aria-hidden /></button>
            </div>
            <nav>
              {nodes.map((node) => (
                <div className="ges-eval-header__mobile-node" key={node.key}>
                  <div>
                    <Link href={node.href || '#'} onClick={() => setOpen(false)}>{node.label}</Link>
                    {node.columns.length > 0 && (
                      <button
                        aria-expanded={expanded === node.key}
                        aria-label={`Expand ${node.label}`}
                        onClick={() => setExpanded(expanded === node.key ? null : node.key)}
                        type="button"
                      >
                        <ChevronDown aria-hidden size={18} />
                      </button>
                    )}
                  </div>
                  {expanded === node.key && (
                    <div className="ges-eval-header__mobile-children">
                      {node.columns.map((column) => (
                        <div key={`${node.key}-${column.label}`}>
                          {column.href ? <Link href={column.href}>{column.label}</Link> : <strong>{column.label}</strong>}
                          {column.links.map((link) => <Link href={link.href} key={`${column.label}-${link.label}`}>{link.label}</Link>)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="ges-eval-header__mobile-actions"><Actions actions={actions} mobile /></div>
          </aside>
        </div>
      )}
    </div>
  );
}

export function GesShowHeaderClient({
  className,
  logo = {},
  catalog = {},
  staticItems,
  actions = {},
  demoBrand = {},
  scrollBehavior = 'static',
}: Props) {
  const isInBuilder = useIsInBuilder();
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const limit = Math.max(1, Math.min(catalog.featuredLimit || 50, 250));
    fetch(`/api/bc/nav-tree?filter=featured&featuredFirst=${limit}`, { signal: controller.signal })
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
  }, [catalog.featuredLimit]);

  const nodes = useMemo(() => {
    const overrideMap = new Map<number, CategoryOverride>();
    catalog.overrides?.forEach((override) => {
      if ((override.matchId ?? 0) > 0) overrideMap.set(override.matchId!, override);
    });

    const apiNodes: MenuNode[] = tree
      .map((root, apiIndex): MenuNode | null => {
        const delta = overrideMap.get(root.entityId);
        if (delta?.hide) return null;
        return {
          key: `api-${root.entityId}`,
          label: delta?.renameLabel?.trim() || root.name,
          href: categoryHref(root.path),
          source: 'api',
          order: delta?.order,
          apiIndex,
          columns: (root.children ?? []).map((child) => ({
            label: child.name,
            href: categoryHref(child.path),
            links: (child.children ?? []).map((leaf) => ({ label: leaf.name, href: categoryHref(leaf.path) })),
          })),
        };
      })
      .filter((node): node is MenuNode => node !== null)
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
          .map((link) => ({ label: link.label!, href: link.href || '#', newTab: link.newTab })),
      })),
    });

    const before = defaults.map((item, index) => ({ item, index })).filter(({ item }) => item.position === 'before').map(({ item, index }) => mapStatic(item, index));
    const after = defaults.map((item, index) => ({ item, index })).filter(({ item }) => item.position !== 'before').map(({ item, index }) => mapStatic(item, index));
    const brand: MenuNode[] = demoBrand.showBrand
      ? [{ key: 'demo-brand', label: demoBrand.brandLabel || 'GES Collections', href: demoBrand.brandHref || '/brands', columns: [], source: 'demo', apiIndex: 0 }]
      : [];

    return [...before, ...apiNodes, ...brand, ...after];
  }, [catalog.overrides, demoBrand, staticItems, tree]);

  const effectiveActions = {
    showLocale: actions.showLocale ?? true,
    showAccount: actions.showAccount ?? true,
    showBooth: actions.showBooth ?? true,
    showContact: actions.showContact ?? true,
    showCart: actions.showCart ?? true,
    showSearch: actions.showSearch ?? true,
    ...actions,
  };
  const unmatchedDeltas = (catalog.overrides ?? []).filter(
    (delta) =>
      (delta.matchId ?? 0) > 0 &&
      !tree.some((category) => category.entityId === delta.matchId),
  );

  return (
    <div className={['ges-eval-header', scrollBehavior === 'sticky' ? 'ges-eval-header--sticky' : '', className].filter(Boolean).join(' ')}>
      <header>
        <div className="ges-eval-header__utility"><Actions actions={{ ...effectiveActions, showBooth: false, showCart: false, showSearch: false }} /></div>
        <div className="ges-eval-header__main">
          <Logo {...logo} />
          <DesktopMenu nodes={nodes} />
          <div className="ges-eval-header__main-actions"><Actions actions={{ ...effectiveActions, showLocale: false, showAccount: false, showContact: false }} /></div>
          <MobileMenu actions={effectiveActions} nodes={nodes} />
        </div>
        <div aria-live="polite" className="ges-eval-header__source-status">
          {status === 'loading' && (catalog.loadingLabel || 'Loading products…')}
          {status === 'error' && 'Static navigation only — catalog unavailable'}
          {status === 'ready' && tree.length === 0 && (catalog.emptyLabel || 'Products')}
        </div>
      </header>
      {isInBuilder && (
        <aside className="ges-eval-header__editor-help">
          <div>
            <strong>API categories available for editing</strong>
            <span>Copy an ID into “Edit or hide API categories.”</span>
          </div>
          <ul>
            {tree.map((category) => (
              <li key={category.entityId}>
                <span>{category.name}</span>
                <code>BC ID {category.entityId}</code>
              </li>
            ))}
          </ul>
          {unmatchedDeltas.length > 0 && (
            <p role="alert">
              No loaded API category matches:{' '}
              {unmatchedDeltas.map((delta) => delta.matchId).join(', ')}. Check the IDs above.
            </p>
          )}
          <small>
            Rename or remove an API category using its ID. To create a new top-level link, use
            “Add new menu items / static pages.”
          </small>
        </aside>
      )}
    </div>
  );
}
