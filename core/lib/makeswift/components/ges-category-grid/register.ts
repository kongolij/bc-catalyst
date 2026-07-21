import { Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesCategoryGridClient } from './client';

runtime.registerComponent(GesCategoryGridClient, {
  type: 'ges-category-grid',
  label: 'GES / Category Grid',
  icon: 'gallery',
  props: {
    className: Style(),
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
    children: Slot(),
  },
});
