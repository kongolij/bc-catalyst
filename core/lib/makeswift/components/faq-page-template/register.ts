import { Group, List, Select, Slot, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { FaqPageTemplate } from './client';

const optionalSlot = () =>
  Slot({
    unstable_placeholder: {
      builderOnly: true,
    },
  });

runtime.registerComponent(FaqPageTemplate, {
  type: 'ges-faq-page-template',
  label: 'GES / Pages / FAQ Template',
  icon: 'carousel',
  props: {
    className: Style(),
    variation: Select({
      label: 'Template variation',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Split panel', value: 'split' },
      ],
      defaultValue: 'centered',
    }),
    eyebrow: TextInput({ label: 'Eyebrow', defaultValue: 'Support' }),
    title: TextInput({ label: 'Title', defaultValue: 'Frequently asked questions' }),
    description: TextArea({
      label: 'Description',
      defaultValue:
        'Find answers to common questions. Add, remove, or reorder FAQ items from the Makeswift panel.',
    }),
    categoryTitle: TextInput({ label: 'Topic title', defaultValue: 'Topics' }),
    categories: List({
      label: 'Topics',
      type: Group({
        label: 'Topic',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Ordering' }),
        },
      }),
      getItemLabel(item) {
        return item?.label || 'Topic';
      },
    }),
    faqs: List({
      label: 'FAQ items',
      type: Group({
        label: 'FAQ item',
        props: {
          question: TextInput({ label: 'Question', defaultValue: 'What question should go here?' }),
          answer: TextArea({
            label: 'Answer',
            defaultValue: 'Write a clear answer that helps customers understand what to do next.',
          }),
        },
      }),
      getItemLabel(item) {
        return item?.question || 'FAQ item';
      },
    }),
    top: optionalSlot(),
    bottom: optionalSlot(),
  },
});
