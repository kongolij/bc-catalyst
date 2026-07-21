import { Group, Image, List, Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesCategoryGridClient } from './client';

runtime.registerComponent(GesCategoryGridClient, {
  type: 'ges-category-grid',
  label: 'GES / Category Grid',
  icon: 'gallery',
  props: {
    className: Style(),
    mode: Select({
      label: 'Source',
      options: [
        { label: 'Auto (all top-level from API)', value: 'api' },
        { label: 'Curated list (drag to reorder)', value: 'curated' },
        { label: 'Manual (drop cards)', value: 'manual' },
      ],
      defaultValue: 'api',
    }),
    columns: Select({
      label: 'Columns (desktop)',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
      ],
      defaultValue: '4',
    }),
    gap: TextInput({
      label: 'Gap (CSS)',
      defaultValue: '16px',
    }),
    limit: TextInput({
      label: 'Max cards (Auto mode, blank = all)',
      defaultValue: '',
    }),
    entries: List({
      label: 'Curated categories',
      type: Group({
        label: 'Category',
        props: {
          categoryId: TextInput({
            label: 'Category ID',
            defaultValue: '',
            description: 'BigCommerce top-level category entity ID',
          }),
          titleOverride: TextInput({ label: 'Title override', defaultValue: '' }),
          iconUrl: Image({ label: 'Icon override' }),
          hrefOverride: TextInput({ label: 'Link override', defaultValue: '' }),
        },
      }),
      getItemLabel: (item) => item?.titleOverride || item?.categoryId || 'Category',
    }),
    children: Slot({ unstable_placeholder: { builderOnly: true } }),
  },
});
