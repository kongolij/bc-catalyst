import { Slot, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { FaqCategory } from './faq-category';

runtime.registerComponent(FaqCategory, {
  type: 'ges-faq-category',
  label: 'GES / FAQ Category',
  icon: 'cube',
  props: {
    title: TextInput({ label: 'Category title (shown in sidebar & as section heading)', defaultValue: 'New Category' }),
    slug: TextInput({
      label: 'Slug (optional — auto-derived from title if blank)',
      defaultValue: '',
    }),
    sortOrder: TextInput({
      label: 'Sort order (lower = higher up in sidebar)',
      defaultValue: '100',
    }),
    children: Slot(),
  },
});
