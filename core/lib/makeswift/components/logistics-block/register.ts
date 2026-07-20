import { Slot, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { LogisticsBlockClient } from './client';

runtime.registerComponent(LogisticsBlockClient, {
  type: 'ges-logistics-block',
  label: 'GES / Logistics Block',
  icon: 'carousel',
  props: {
    className: Style(),
    content: Slot({
      unstable_placeholder: {
        builderOnly: true,
      },
    }),
  },
});
