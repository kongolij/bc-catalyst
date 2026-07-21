import { RichText, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { LogisticsCardClient } from './client';

runtime.registerComponent(LogisticsCardClient, {
  type: 'ges-logistics-card',
  label: 'GES / Logistics Card',
  icon: 'carousel',
  props: {
    className: Style(),
    heading: TextInput({
      label: 'Heading',
      defaultValue: 'SHIPPING TO THE SHOW WITH GES LOGISTICS - WE CAN SHIP IT FOR YOU',
    }),
    body: RichText(),
    actions: Slot({
      unstable_placeholder: { builderOnly: true },
    }),
  },
});
