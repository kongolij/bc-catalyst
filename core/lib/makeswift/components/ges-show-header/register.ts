import { Checkbox, Color, Combobox, Group, Image, List, Number, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesShowHeaderClient } from './client';

export const GES_SHOW_HEADER_COMPONENT_TYPE = 'ges-show-header-evaluation';

interface CategoryOptionNode {
  entityId: number;
  name: string;
  children?: CategoryOptionNode[];
}

interface CategoryOption {
  id: string;
  label: string;
  value: string;
  depth: number;
}

function flattenCategoryOptions(nodes: CategoryOptionNode[], parents: string[] = [], depth = 1): CategoryOption[] {
  return nodes.flatMap((node) => {
    const breadcrumb = [...parents, node.name];

    return [
      {
        id: String(node.entityId),
        label: `${breadcrumb.join(' › ')} (BC ${node.entityId})`,
        value: String(node.entityId),
        depth,
      },
      ...flattenCategoryOptions(node.children ?? [], breadcrumb, depth + 1),
    ];
  });
}

async function fetchFeaturedCategoryOptions(query: string, maximumDepth = 3) {
  try {
    const response = await fetch('/api/bc/nav-tree?filter=featured&featuredFirst=50');
    if (!response.ok) return [];

    const data = (await response.json()) as {
      tree?: CategoryOptionNode[];
    };
    const search = query.trim().toLowerCase();

    return flattenCategoryOptions(data.tree ?? [])
      .filter((category) => category.depth <= maximumDepth)
      .filter((category) => !search || category.label.toLowerCase().includes(search) || category.value.includes(search))
      .map((category) => ({ id: category.id, label: category.label, value: category.value }));
  } catch {
    return [];
  }
}

const fetchEditableCategoryOptions = (query: string) => fetchFeaturedCategoryOptions(query);
const fetchCategoryParentOptions = (query: string) => fetchFeaturedCategoryOptions(query, 2);

runtime.registerComponent(GesShowHeaderClient, {
  type: GES_SHOW_HEADER_COMPONENT_TYPE,
  label: 'GES / Navigation / Show Header (API + delta)',
  description: 'Evaluation header: featured-product BC categories + small editorial deltas + static page navigation.',
  icon: 'navigation',
  props: {
    className: Style(),
    logo: Group({
      label: 'Logo',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        source: Select({
          label: 'Logo source',
          options: [
            { label: 'Default GES logo', value: 'default' },
            { label: 'Custom uploaded logo', value: 'custom' },
          ],
          defaultValue: 'default',
        }),
        image: Image({ label: 'Custom logo image' }),
        alt: TextInput({ label: 'Alt text', defaultValue: 'GES' }),
        text: TextInput({ label: 'Fallback text', defaultValue: 'GES' }),
        href: TextInput({ label: 'Home link', defaultValue: '/' }),
      },
    }),
    catalog: Group({
      label: 'Commerce menu — API + delta',
      props: {
        overrides: List({
          label: 'Rename, hide, or reorder categories',
          type: Group({
            label: 'Category change',
            props: {
              matchId: Combobox({
                label: 'Search the complete featured taxonomy',
                getOptions: fetchEditableCategoryOptions,
              }),
              hide: Checkbox({
                label: 'Hide from header',
                defaultValue: false,
              }),
              renameLabel: TextInput({
                label: 'Header name (blank keeps BC name)',
                defaultValue: '',
              }),
              order: Number({
                label: 'Menu order (blank/0 keeps API order)',
                defaultValue: 0,
              }),
            },
          }),
          getItemLabel: (item: { renameLabel?: string; matchId?: number | string | { label?: string; value?: string } }) => {
            if (item?.renameLabel) return item.renameLabel;
            if (typeof item?.matchId === 'object') return item.matchId.label || 'Selected category';
            return item?.matchId ? `BC category ${item.matchId}` : 'Choose a category';
          },
        }),
        additions: List({
          label: 'Add links beneath BC categories',
          type: Group({
            label: 'New category link',
            props: {
              parentId: Combobox({
                label: 'Search and select a root or subcategory',
                getOptions: fetchCategoryParentOptions,
              }),
              label: TextInput({ label: 'New link name', defaultValue: 'New link' }),
              href: TextInput({ label: 'Link URL', defaultValue: '' }),
              order: Number({ label: 'Order (blank/0 places it last)', defaultValue: 0 }),
            },
          }),
          getItemLabel: (item: { label?: string }) => item?.label || 'New category link',
        }),
      },
    }),
    staticItems: List({
      label: 'Add new menu items / static pages',
      type: Group({
        label: 'Static menu item',
        props: {
          label: TextInput({
            label: 'Label',
            defaultValue: 'Show Information',
          }),
          href: TextInput({ label: 'Link (optional)', defaultValue: '' }),
          position: Select({
            label: 'Position',
            options: [
              { value: 'before', label: 'Before commerce categories' },
              { value: 'after', label: 'After commerce categories' },
            ],
            defaultValue: 'after',
          }),
          groups: List({
            label: 'Dropdown groups',
            type: Group({
              label: 'Dropdown group',
              props: {
                label: TextInput({
                  label: 'Group label',
                  defaultValue: 'Show information',
                }),
                href: TextInput({
                  label: 'Group link (optional)',
                  defaultValue: '',
                }),
                links: List({
                  label: 'Links',
                  type: Group({
                    label: 'Link',
                    props: {
                      label: TextInput({
                        label: 'Label',
                        defaultValue: 'Quick facts',
                      }),
                      href: TextInput({ label: 'URL', defaultValue: '' }),
                      newTab: Checkbox({
                        label: 'Open in new tab',
                        defaultValue: false,
                      }),
                    },
                  }),
                  getItemLabel: (item: { label?: string }) => item?.label || 'Link',
                }),
              },
            }),
            getItemLabel: (item: { label?: string }) => item?.label || 'Group',
          }),
        },
      }),
      getItemLabel: (item: { label?: string }) => item?.label || 'Static item',
    }),
    appearance: Group({
      label: 'Navigation appearance',
      props: {
        backgroundColor: Color({ label: 'Navigation background color', defaultValue: '#ffffff' }),
      },
    }),
    actions: Group({
      label: 'Header right side',
      props: {
        showLocale: Checkbox({ label: 'Show locale', defaultValue: true }),
        showAccount: Checkbox({ label: 'Show account', defaultValue: true }),
        showBooth: Checkbox({ label: 'Show booth', defaultValue: true }),
        showContact: Checkbox({ label: 'Show contact us', defaultValue: true }),
        showCart: Checkbox({ label: 'Show cart', defaultValue: true }),
        showSearch: Checkbox({ label: 'Show search', defaultValue: true }),
        localeLabel: TextInput({ label: 'Locale label', defaultValue: 'EN' }),
        accountLabel: TextInput({
          label: 'Account label',
          defaultValue: 'Account',
        }),
        accountHref: TextInput({
          label: 'Account link',
          defaultValue: '/login',
        }),
        boothLabel: TextInput({
          label: 'Booth label',
          defaultValue: 'Find or Add Your Booth',
        }),
        boothHref: TextInput({
          label: 'Booth link',
          defaultValue: '/account/shows',
        }),
        contactLabel: TextInput({
          label: 'Contact label',
          defaultValue: 'Contact Us',
        }),
        contactHref: TextInput({
          label: 'Contact link',
          defaultValue: '/contact-us',
        }),
        cartHref: TextInput({ label: 'Cart link', defaultValue: '/cart' }),
        demoCartCount: Number({ label: 'Demo cart count', defaultValue: 2 }),
      },
    }),
    demoBrand: Group({
      label: 'Demo fallback data',
      props: {
        showBrand: Checkbox({
          label: 'Show demo brand link',
          defaultValue: false,
        }),
        brandLabel: TextInput({
          label: 'Brand label',
          defaultValue: 'GES Collections',
        }),
        brandHref: TextInput({ label: 'Brand link', defaultValue: '/brands' }),
      },
    }),
    scrollBehavior: Select({
      label: 'Scroll behavior',
      options: [
        { value: 'static', label: 'Static (recommended for evaluation)' },
        { value: 'sticky', label: 'Sticky' },
      ],
      defaultValue: 'static',
    }),
  },
});
