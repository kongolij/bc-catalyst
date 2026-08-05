import { Checkbox, Group, Image, List, Number, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesShowHeaderClient } from './client';

runtime.registerComponent(GesShowHeaderClient, {
  type: 'ges-show-header-evaluation',
  label: 'GES / Navigation / Show Header (API + delta)',
  description:
    'Evaluation header: featured-product BC categories + small editorial deltas + static page navigation.',
  icon: 'navigation',
  props: {
    className: Style(),
    logo: Group({
      label: 'Logo',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        image: Image({ label: 'Logo image' }),
        alt: TextInput({ label: 'Alt text', defaultValue: 'GES' }),
        text: TextInput({ label: 'Fallback text', defaultValue: 'GES' }),
        href: TextInput({ label: 'Home link', defaultValue: '/' }),
      },
    }),
    catalog: Group({
      label: 'Commerce menu — API + delta',
      props: {
        featuredLimit: Number({ label: 'Featured products to inspect', defaultValue: 50 }),
        loadingLabel: TextInput({ label: 'Loading label', defaultValue: 'Loading products…' }),
        emptyLabel: TextInput({
          label: 'No eligible categories label',
          defaultValue: 'Products',
        }),
        overrides: List({
          label: 'Edit or hide API categories',
          type: Group({
            label: 'API category edit',
            props: {
              matchId: Number({ label: 'BC category ID (copy from preview)', defaultValue: 0 }),
              hide: Checkbox({ label: 'Remove this category from the menu', defaultValue: false }),
              renameLabel: TextInput({
                label: 'New menu name (blank keeps BC name)',
                defaultValue: '',
              }),
              order: Number({ label: 'Order override (blank/0 = API order)', defaultValue: 0 }),
            },
          }),
          getItemLabel: (item: { renameLabel?: string; matchId?: number }) =>
            item?.renameLabel
              ? `${item.renameLabel} (id ${item.matchId ?? 0})`
              : item?.matchId
                ? `BC category ${item.matchId}`
                : 'Set a BC category ID',
        }),
      },
    }),
    staticItems: List({
      label: 'Add new menu items / static pages',
      type: Group({
        label: 'Static menu item',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Show Information' }),
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
                label: TextInput({ label: 'Group label', defaultValue: 'Show information' }),
                href: TextInput({ label: 'Group link (optional)', defaultValue: '' }),
                links: List({
                  label: 'Links',
                  type: Group({
                    label: 'Link',
                    props: {
                      label: TextInput({ label: 'Label', defaultValue: 'Quick facts' }),
                      href: TextInput({ label: 'URL', defaultValue: '' }),
                      newTab: Checkbox({ label: 'Open in new tab', defaultValue: false }),
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
        accountLabel: TextInput({ label: 'Account label', defaultValue: 'Account' }),
        accountHref: TextInput({ label: 'Account link', defaultValue: '/login' }),
        boothLabel: TextInput({ label: 'Booth label', defaultValue: 'Find or Add Your Booth' }),
        boothHref: TextInput({ label: 'Booth link', defaultValue: '/account/shows' }),
        contactLabel: TextInput({ label: 'Contact label', defaultValue: 'Contact Us' }),
        contactHref: TextInput({ label: 'Contact link', defaultValue: '/contact-us' }),
        cartHref: TextInput({ label: 'Cart link', defaultValue: '/cart' }),
        demoCartCount: Number({ label: 'Demo cart count', defaultValue: 2 }),
      },
    }),
    demoBrand: Group({
      label: 'Demo fallback data',
      props: {
        showBrand: Checkbox({ label: 'Show demo brand link', defaultValue: false }),
        brandLabel: TextInput({ label: 'Brand label', defaultValue: 'GES Collections' }),
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
