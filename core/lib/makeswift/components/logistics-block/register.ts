import { Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { LogisticsBlockClient } from './client';

runtime.registerComponent(LogisticsBlockClient, {
  type: 'ges-logistics-block',
  label: 'GES / Logistics Block',
  icon: 'carousel',
  props: {
    className: Style(),
    title: TextInput({ label: 'Section title', defaultValue: 'GES Logistics' }),
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
    content: Slot({
      unstable_placeholder: { builderOnly: true },
    }),
  },
});
