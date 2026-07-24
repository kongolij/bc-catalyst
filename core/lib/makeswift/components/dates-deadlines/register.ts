import { Select, Slot, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { DatesDeadlinesClient } from './client';

runtime.registerComponent(DatesDeadlinesClient, {
  type: 'ges-dates-deadlines',
  label: 'GES / Blocks / Dates & Deadlines',
  icon: 'carousel',
  props: {
    className: Style(),
    title: TextInput({
      label: 'Section title',
      defaultValue: 'Important Dates and Deadlines',
    }),
    titleVariant: Select({
      label: 'Title style',
      options: [
        { label: 'Section Heading (H2)', value: 'h2' },
        { label: 'Page Heading (H1)', value: 'h1' },
        { label: 'Sub-heading (H3)', value: 'h3' },
        { label: 'Eyebrow', value: 'eyebrow' },
      ],
      defaultValue: 'h2',
    }),
    description: TextArea({ label: 'Description (leave empty to hide)' }),
    mode: Select({
      label: 'Content source',
      options: [
        { label: 'Load from API', value: 'api' },
        { label: 'Author on canvas', value: 'canvas' },
      ],
      defaultValue: 'api',
    }),
    content: Slot({
      unstable_placeholder: { builderOnly: true },
    }),
  },
});
