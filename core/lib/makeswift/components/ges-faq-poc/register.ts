import {
  Checkbox,
  Color,
  Group,
  List,
  Select,
  Slot,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesFaqFilterClient } from './filter-client';
import { GesFaqPageClient } from './page-client';
import { GesFaqSectionClient } from './section-client';

runtime.registerComponent(GesFaqPageClient, {
  type: 'ges-faq-poc-page',
  label: 'GES / FAQ POC / Page',
  icon: 'cube',
  props: {
    className: Style(),
    title: TextInput({ label: 'Page title', defaultValue: 'FAQs' }),
    defaultCategorySlug: TextInput({
      label: 'Default category slug (e.g. general)',
      defaultValue: '',
    }),
    syncToUrl: Checkbox({ label: 'Sync active filter to ?category=', defaultValue: true }),
    sidebar: Slot(),
    content: Slot(),
  },
});

runtime.registerComponent(GesFaqFilterClient, {
  type: 'ges-faq-poc-filter',
  label: 'GES / FAQ POC / Filter',
  icon: 'cube',
  props: {
    className: Style(),
    title: TextInput({ label: 'Title', defaultValue: 'Filter FAQs' }),
    clearLabel: TextInput({ label: 'Clear filter label', defaultValue: '× Clear filter' }),
    emptyMessage: TextInput({
      label: 'Empty state message',
      defaultValue: 'Drop FAQ sections on the page — they will appear here automatically.',
    }),
  },
});

runtime.registerComponent(GesFaqSectionClient, {
  type: 'ges-faq-poc-section',
  label: 'GES / FAQ POC / Section',
  icon: 'cube',
  props: {
    className: Style(),
    categorySlug: TextInput({
      label: 'Category slug (stable ID — safe to rename title)',
      defaultValue: '',
    }),
    title: TextInput({ label: 'Section title', defaultValue: 'Section Title' }),
    type: Select({
      label: 'Selection type',
      options: [
        { value: 'single', label: 'Single' },
        { value: 'multiple', label: 'Multiple' },
      ],
      defaultValue: 'multiple',
    }),
    colorScheme: Select({
      label: 'Color scheme',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
      defaultValue: 'light',
    }),
    accordions: List({
      label: 'Accordions',
      type: Group({
        label: 'Accordion item',
        props: {
          title: TextInput({ label: 'Title', defaultValue: 'Question' }),
          bgColor: Color({ label: 'Background Color', defaultValue: '#ffffff' }),
          textColor: Color({ label: 'Text Color', defaultValue: '#000000' }),
          classNameCss: Style({ properties: Style.All }),
          children: Slot(),
        },
      }),
      getItemLabel(accordion) {
        return accordion?.title || 'Accordion';
      },
    }),
  },
});
