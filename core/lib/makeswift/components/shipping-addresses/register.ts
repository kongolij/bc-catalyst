import { Checkbox, Slot, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { ShippingAddressesClient } from './client';

const inlineSlot = () =>
  Slot({
    unstable_placeholder: {
      builderOnly: true,
    },
  });

runtime.registerComponent(ShippingAddressesClient, {
  type: 'ges-shipping-addresses',
  label: 'GES / Shipping Addresses',
  icon: 'carousel',
  props: {
    className: Style(),
    header: inlineSlot(),
    useApiAddresses: Checkbox({
      label: 'Load addresses from API (turn off to edit content in-place below)',
      defaultValue: true,
    }),
    manualContent: inlineSlot(),
  },
});
