import { Checkbox, Group, List, Slot, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

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
      label: 'Load addresses from API',
      defaultValue: true,
    }),
    manualAddresses: List({
      label: 'Manual addresses (when API disabled)',
      type: Group({
        label: 'Address',
        props: {
          title: TextInput({ label: 'Title', defaultValue: 'Shipping Address' }),
          lines: List({
            label: 'Address lines',
            type: TextInput({ label: 'Line', defaultValue: '' }),
          }),
          notes: TextArea({ label: 'Notes', defaultValue: '' }),
        },
      }),
      getItemLabel(item) {
        return item?.title || 'Address';
      },
    }),
  },
});
