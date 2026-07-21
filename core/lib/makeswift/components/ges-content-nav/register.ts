import { Group, List, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesContentNavClient } from './client';

runtime.registerComponent(GesContentNavClient, {
  type: 'ges-content-nav',
  label: 'GES / Content Nav (Manual)',
  icon: 'navigation',
  props: {
    className: Style(),
    items: List({
      label: 'Top-level items',
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
