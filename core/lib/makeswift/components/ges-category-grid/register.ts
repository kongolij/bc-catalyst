import { Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

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
        { label: 'Auto-populate from API', value: 'api' },
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
      label: 'Max cards (API mode, blank = all)',
      defaultValue: '',
    }),
    hiddenIds: TextInput({
      label: 'Hide category IDs (comma-separated)',
      defaultValue: '',
    }),
    orderIds: TextInput({
      label: 'Order override (comma-separated IDs)',
      defaultValue: '',
    }),
    children: Slot({ unstable_placeholder: { builderOnly: true } }),
  },
});
