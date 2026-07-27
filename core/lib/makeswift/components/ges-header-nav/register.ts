import {
  Checkbox,
  Group,
  List,
  Number,
  Select,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesHeaderNavClient } from './client';

runtime.registerComponent(GesHeaderNavClient, {
  type: 'ges-header-nav',
  label: 'GES / Navigation / Header (Hybrid)',
  icon: 'navigation',
  props: {
    className: Style(),
    mode: Select({
      label: 'Catalog source',
      options: [
        { value: 'auto-featured', label: 'Auto (categories with featured products)' },
        { value: 'auto-all', label: 'Auto (all categories)' },
      ],
      defaultValue: 'auto-featured',
    }),
    overrides: List({
      label: 'Category overrides',
      type: Group({
        label: 'Override',
        props: {
          matchId: Number({
            label: 'BC category entityId to match',
            defaultValue: 0,
          }),
          hide: Checkbox({ label: 'Hide this root category', defaultValue: false }),
          renameLabel: TextInput({
            label: 'Rename label (blank = keep BC name)',
            defaultValue: '',
          }),
          extraChildren: List({
            label: 'Additional sub-items to append',
            type: Group({
              label: 'Sub-item',
              props: {
                label: TextInput({ label: 'Label', defaultValue: 'New link' }),
                href: TextInput({ label: 'URL', defaultValue: '' }),
              },
            }),
            getItemLabel: (l) => l?.label || 'Link',
          }),
        },
      }),
      getItemLabel: (o) =>
        o?.renameLabel
          ? `${o.renameLabel} (id ${o.matchId ?? 0})`
          : `id ${o?.matchId ?? 0}`,
    }),
    extraItems: List({
      label: 'Additional top-level items (static pages or new roots)',
      type: Group({
        label: 'Item',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Show Information' }),
          href: TextInput({ label: 'Link (optional)', defaultValue: '' }),
          position: Select({
            label: 'Position',
            options: [
              { value: 'append', label: 'Append after BC roots' },
              { value: 'prepend', label: 'Prepend before BC roots' },
            ],
            defaultValue: 'append',
          }),
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
                      label: TextInput({ label: 'Label', defaultValue: 'Quick Facts' }),
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
