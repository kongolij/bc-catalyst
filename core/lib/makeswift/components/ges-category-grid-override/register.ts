import {
  Checkbox,
  Combobox,
  Group,
  Image,
  List,
  Select,
  Slot,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesCategoryGridOverrideClient } from './client';

async function fetchApiTopLevelOptions(query: string) {
  try {
    const res = await fetch('/api/bc/categories/top-level');
    const data = (await res.json()) as {
      categories: Array<{ entityId: number; name: string }>;
    };
    const q = (query ?? '').toLowerCase();
    return (data.categories ?? [])
      .filter(
        (c) => !q || c.name.toLowerCase().includes(q) || String(c.entityId).includes(q),
      )
      .map((c) => ({
        id: String(c.entityId),
        label: `${c.name} (${c.entityId})`,
        value: String(c.entityId),
      }));
  } catch {
    return [];
  }
}

runtime.registerComponent(GesCategoryGridOverrideClient, {
  type: 'ges-category-grid-override',
  label: 'GES / Category Grid (Override)',
  icon: 'gallery',
  props: {
    className: Style(),
    disableApi: Checkbox({
      label: 'Disable API (manual entries + dropped cards only)',
      defaultValue: false,
    }),
    apiFilter: Select({
      label: 'Auto filter (data source)',
      options: [
        { label: 'Featured', value: 'featured' },
        { label: 'Best-Selling', value: 'best-selling' },
        { label: 'All top-level', value: 'all' },
      ],
      defaultValue: 'featured',
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
    gap: TextInput({ label: 'Gap (CSS)', defaultValue: '16px' }),
    limit: TextInput({
      label: 'Max API cards to show (blank = all)',
      defaultValue: '',
    }),
    manualEntries: List({
      label: 'Manual entries (override or add)',
      type: Group({
        label: 'Entry',
        props: {
          matchId: Combobox({
            label: 'Override top-level category (leave empty to add a new one)',
            getOptions: fetchApiTopLevelOptions,
          }),
          categoryId: TextInput({
            label: 'BC category ID (used when adding a new card)',
            defaultValue: '',
          }),
          titleOverride: TextInput({ label: 'Title override', defaultValue: '' }),
          iconUrl: Image({ label: 'Icon override' }),
          hrefOverride: TextInput({ label: 'Link override', defaultValue: '' }),
        },
      }),
      getItemLabel: (item) => {
        const m = item?.matchId;
        const matchStr = typeof m === 'string' ? m : m?.value;
        if (matchStr) return `Override: ${matchStr}`;
        return item?.titleOverride || item?.categoryId || 'New entry';
      },
    }),
    hiddenIds: List({
      label: 'Hide top-level categories',
      type: Group({
        label: 'Hidden category',
        props: {
          id: Combobox({
            label: 'Category to hide',
            getOptions: fetchApiTopLevelOptions,
          }),
        },
      }),
      getItemLabel: (h) => {
        const v = h?.id;
        const s = typeof v === 'string' ? v : v?.value;
        return s || 'category';
      },
    }),
    children: Slot({ unstable_placeholder: { builderOnly: true } }),
  },
});
