import {
  Checkbox,
  Combobox,
  Group,
  List,
  Slot,
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
  answer: string;
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

async function fetchItemOptions(query: string) {
  try {
    const res = await fetch('/api/ges/faqs');
    const { categories, items } = (await res.json()) as {
      categories: ApiCategory[];
      items: ApiItem[];
    };
    const catTitleById = new Map(categories.map((c) => [c.id, c.title]));
    const q = (query ?? '').toLowerCase();
    const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
    return items
      .filter(
        (it) =>
          !q ||
          it.question.toLowerCase().includes(q) ||
          it.id.toLowerCase().includes(q) ||
          it.categoryId.toLowerCase().includes(q),
      )
      .slice(0, 200)
      .map((it) => ({
        id: it.id,
        value: it.id,
        label: `[${catTitleById.get(it.categoryId) ?? it.categoryId}] ${truncate(it.question, 80)}`,
      }));
  } catch {
    return [];
  }
}

runtime.registerComponent(GesFaqOverrideClient, {
  type: 'ges-faq-override',
  label: 'GES / FAQ / Main',
  icon: 'cube',
  props: {
    className: Style(),
    title: TextInput({ label: 'Page title', defaultValue: 'Frequently Asked Questions' }),

    // Right panel content — drop FAQ Section blocks in here to override the API-driven view
    children: Slot(),

    // --- Right-panel behavior ---
    defaultCategoryId: Combobox({
      label: 'Default category (leave blank to show placeholder until a filter is clicked)',
      getOptions: fetchCategoryOptions,
    }),
    emptyStateTitle: TextInput({
      label: 'Empty-state title (right panel, when nothing is selected)',
      defaultValue: 'Choose a category',
    }),
    emptyStateMessage: TextArea({
      label: 'Empty-state message',
      defaultValue: 'Select a topic from the sidebar to view its frequently asked questions.',
    }),

    // --- Sidebar behavior ---
    sidebarTitle: TextInput({ label: 'Sidebar title', defaultValue: 'Filter FAQs' }),
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

    // --- Per-item content overrides ---
    hiddenItemIds: List({
      label: 'Hide FAQ items',
      type: Group({
        label: 'Hidden item',
        props: {
          id: Combobox({ label: 'FAQ item to hide', getOptions: fetchItemOptions }),
        },
      }),
      getItemLabel: (h) => {
        const v = h?.id;
        const s = typeof v === 'string' ? v : v?.value;
        return s || 'item';
      },
    }),

    itemOverrides: List({
      label: 'Override FAQ item text (leave a field blank to keep the API value)',
      type: Group({
        label: 'Item override',
        props: {
          matchId: Combobox({ label: 'FAQ item', getOptions: fetchItemOptions }),
          questionOverride: TextInput({
            label: 'Question override (blank = use API question)',
            defaultValue: '',
          }),
          answerOverride: TextArea({
            label: 'Answer override (blank = use API answer)',
            defaultValue: '',
          }),
        },
      }),
      getItemLabel: (o) => {
        const m = o?.matchId;
        const s = typeof m === 'string' ? m : m?.value;
        return o?.questionOverride ? `${s ?? '?'} → ${o.questionOverride}` : (s ?? 'Item override');
      },
    }),

    additionalItems: List({
      label: 'Add new FAQ items (appended to the chosen category)',
      type: Group({
        label: 'New FAQ item',
        props: {
          categoryId: Combobox({
            label: 'Category',
            getOptions: fetchCategoryOptions,
          }),
          question: TextInput({ label: 'Question', defaultValue: 'New question' }),
          answer: TextArea({ label: 'Answer', defaultValue: '' }),
        },
      }),
      getItemLabel: (i) => i?.question || 'New FAQ item',
    }),

    customSidebarEntries: List({
      label: 'Add custom sidebar filters (link a slug to a New FAQ (Blank) section)',
      type: Group({
        label: 'Custom filter',
        props: {
          label: TextInput({ label: 'Sidebar label (shown to visitors)', defaultValue: '' }),
          slug: TextInput({
            label: 'Filter slug (must match the slug on the New FAQ section)',
            defaultValue: '',
          }),
          sortOrder: TextInput({
            label: 'Sort order (lower = higher up; blank = 999)',
            defaultValue: '',
          }),
        },
      }),
      getItemLabel: (e) => e?.label || e?.slug || 'Custom filter',
    }),

    categoryDisplay: List({
      label: 'Rename / reorder categories (sidebar only — content is unchanged)',
      type: Group({
        label: 'Category display',
        props: {
          matchId: Combobox({ label: 'Category', getOptions: fetchCategoryOptions }),
          labelOverride: TextInput({
            label: 'Display label (blank = use API title)',
            defaultValue: '',
          }),
          sortOverride: TextInput({
            label: 'Sort order (lower = higher up; blank = use API sort)',
            defaultValue: '',
          }),
        },
      }),
      getItemLabel: (o) => {
        const m = o?.matchId;
        const s = typeof m === 'string' ? m : m?.value;
        return o?.labelOverride ? `${s ?? '?'} → ${o.labelOverride}` : (s ?? 'Category display');
      },
    }),
  },
});
