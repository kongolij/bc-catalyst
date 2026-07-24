import {
  Checkbox,
  Combobox,
  Group,
  List,
  Style,
  TextArea,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesFaqOverrideClient } from './client';

interface ApiCategory {
  id: string;
  title: string;
  count: number;
}

interface ApiItem {
  id: string;
  categoryId: string;
  question: string;
}

async function fetchApi(): Promise<{ categories: ApiCategory[]; items: ApiItem[] }> {
  try {
    const res = await fetch('/api/ges/faqs');
    return (await res.json()) as { categories: ApiCategory[]; items: ApiItem[] };
  } catch {
    return { categories: [], items: [] };
  }
}

async function fetchCategoryOptions(query: string) {
  const { categories } = await fetchApi();
  const q = (query ?? '').toLowerCase();
  return categories
    .filter((c) => !q || c.title.toLowerCase().includes(q) || c.id.includes(q))
    .map((c) => ({ id: c.id, label: `${c.title} (${c.id})`, value: c.id }));
}

async function fetchItemOptions(query: string) {
  const { items, categories } = await fetchApi();
  const catTitleById = new Map(categories.map((c) => [c.id, c.title]));
  const q = (query ?? '').toLowerCase();
  return items
    .filter(
      (i) =>
        !q ||
        i.question.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        (catTitleById.get(i.categoryId) ?? '').toLowerCase().includes(q),
    )
    .slice(0, 50)
    .map((i) => ({
      id: i.id,
      label: `[${catTitleById.get(i.categoryId) ?? i.categoryId}] ${i.question}`,
      value: i.id,
    }));
}

runtime.registerComponent(GesFaqOverrideClient, {
  type: 'ges-faq-override',
  label: 'GES / FAQ (Override)',
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
    showDataDiagnostics: Checkbox({
      label: 'Show API/override diagnostics',
      defaultValue: false,
    }),
    hiddenCategoryIds: List({
      label: 'Hide categories',
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
    categoryOverrides: List({
      label: 'Category overrides (rename or reorder)',
      type: Group({
        label: 'Category override',
        props: {
          matchId: Combobox({ label: 'Category to override', getOptions: fetchCategoryOptions }),
          titleOverride: TextInput({ label: 'Title override', defaultValue: '' }),
          sortOrder: TextInput({
            label: 'Sort order (lower = higher up; blank = source value)',
            defaultValue: '',
          }),
        },
      }),
      getItemLabel: (o) => {
        const m = o?.matchId;
        const s = typeof m === 'string' ? m : m?.value;
        return o?.titleOverride ? `${s ?? '?'} → ${o.titleOverride}` : (s ?? 'Category override');
      },
    }),
    hiddenItemIds: List({
      label: 'Hide individual FAQs',
      type: Group({
        label: 'Hidden FAQ',
        props: {
          id: Combobox({ label: 'FAQ to hide', getOptions: fetchItemOptions }),
        },
      }),
      getItemLabel: (h) => {
        const v = h?.id;
        const s = typeof v === 'string' ? v : v?.value;
        return s || 'FAQ';
      },
    }),
    itemOverrides: List({
      label: 'FAQ overrides (edit individual lines)',
      type: Group({
        label: 'FAQ override',
        props: {
          matchId: Combobox({ label: 'FAQ to override', getOptions: fetchItemOptions }),
          categoryIdOverride: Combobox({
            label: 'Move to category (optional)',
            getOptions: fetchCategoryOptions,
          }),
          questionOverride: TextInput({ label: 'Question override', defaultValue: '' }),
          answerOverride: TextArea({ label: 'Answer override', defaultValue: '' }),
        },
      }),
      getItemLabel: (o) => {
        const m = o?.matchId;
        const s = typeof m === 'string' ? m : m?.value;
        return o?.questionOverride ? o.questionOverride : (s ?? 'FAQ override');
      },
    }),
    additionalItems: List({
      label: 'Add local FAQs (not from API)',
      type: Group({
        label: 'Local FAQ',
        props: {
          categoryId: Combobox({
            label: 'Category to append to',
            getOptions: fetchCategoryOptions,
          }),
          question: TextInput({ label: 'Question', defaultValue: '' }),
          answer: TextArea({ label: 'Answer', defaultValue: '' }),
        },
      }),
      getItemLabel: (row) => row?.question || 'New FAQ',
    }),
  },
});
