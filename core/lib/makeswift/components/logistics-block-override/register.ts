import { Checkbox, Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { LogisticsBlockOverrideClient } from './client';

runtime.registerComponent(LogisticsBlockOverrideClient, {
  type: 'ges-logistics-block-override',
  label: 'GES / Logistics Block (Override)',
  icon: 'carousel',
  props: {
    className: Style(),
    title: TextInput({ label: 'Section title', defaultValue: 'GES LOGISTICS' }),
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
    beforeSlot: Slot({ unstable_placeholder: { builderOnly: true } }),
    useOverrideBody: Checkbox({
      label: 'Replace API body with authored content',
      defaultValue: false,
    }),
    overrideBody: Slot({ unstable_placeholder: { builderOnly: true } }),
    afterSlot: Slot({ unstable_placeholder: { builderOnly: true } }),
  },
});
