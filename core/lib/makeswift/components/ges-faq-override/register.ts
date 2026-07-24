import { Checkbox, Combobox, Group, List, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesFaqOverrideClient } from './client';

interface ApiCategory {
  id: string;
  title: string;
  count: number;
}

async function fetchCategoryOptions(query: string) {
  try {
    const res = await fetch('/api/ges/faqs');
    const { categories } = (await res.json()) as { categories: ApiCategory[] };
    const q = (query ?? '').toLowerCase();
    return categories
      .filter((c) => !q || c.title.toLowerCase().includes(q) || c.id.includes(q))
      .map((c) => ({ id: c.id, label: `${c.title} (${c.count})`, value: c.id }));
  } catch {
    return [];
  }
}

runtime.registerComponent(GesFaqOverrideClient, {
  type: 'ges-faq-override',
  label: 'GES / FAQ',
  icon: 'cube',
  props: {
    className: Style(),
    title: TextInput({ label: 'Page title', defaultValue: 'Frequently Asked Questions' }),
    defaultCategoryId: Combobox({
      label: 'Default category (shown on load / after Clear Filter)',
      getOptions: fetchCategoryOptions,
    }),
    clearLabel: TextInput({ label: 'Clear filter label', defaultValue: '× Clear Filter' }),
    showCounts: Checkbox({ label: 'Show counts in sidebar', defaultValue: true }),
    syncToUrl: Checkbox({ label: 'Sync active filter to ?category=', defaultValue: true }),
    hiddenCategoryIds: List({
      label: 'Hide categories from sidebar',
      type: Group({
        label: 'Hidden category',
        props: {
          id: Combobox({ label: 'Category to hide', getOptions: fetchCategoryOptions }),
        },
      }),
      getItemLabel: (h) => {
        const v = h?.id;
        const s = typeof v === 'string' ? v : v?.value;
        return s || 'category';
      },
    }),
  },
});
