import { Group, List, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesCatalogNavClient } from './client';

runtime.registerComponent(GesCatalogNavClient, {
  type: 'ges-catalog-nav',
  label: 'GES / Navigation / Catalog',
  icon: 'navigation',
  props: {
    className: Style(),
    mode: Select({
      label: 'Source',
      options: [
        { value: 'auto-featured', label: 'Auto (categories with featured products)' },
        { value: 'auto-all', label: 'Auto (all categories)' },
        { value: 'manual', label: 'Manual' },
      ],
      defaultValue: 'auto-featured',
    }),
    items: List({
      label: 'Manual items (used in Manual mode)',
      type: Group({
        label: 'Item',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Menu item' }),
          href: TextInput({ label: 'Link (optional)', defaultValue: '' }),
          groups: List({
            label: 'Dropdown columns',
            type: Group({
              label: 'Column',
              props: {
                label: TextInput({ label: 'Column heading', defaultValue: 'Group' }),
                href: TextInput({ label: 'Heading link (optional)', defaultValue: '' }),
                links: List({
                  label: 'Column links',
                  type: Group({
                    label: 'Link',
                    props: {
                      label: TextInput({ label: 'Label', defaultValue: 'Link' }),
                      href: TextInput({ label: 'URL', defaultValue: '' }),
                    },
                  }),
                  getItemLabel: (l) => l?.label || 'Link',
                }),
              },
            }),
            getItemLabel: (c) => c?.label || 'Column',
          }),
        },
      }),
      getItemLabel: (i) => i?.label || 'Item',
    }),
  },
});
