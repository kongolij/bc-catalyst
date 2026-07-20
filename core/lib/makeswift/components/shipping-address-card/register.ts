import { Slot, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { ShippingAddressCardClient } from './client';

runtime.registerComponent(ShippingAddressCardClient, {
  type: 'ges-shipping-address-card',
  label: 'GES / Shipping Address Card',
  icon: 'carousel',
  props: {
    className: Style(),
    title: TextInput({
      label: 'Card title',
      defaultValue: 'Advance Shipment Warehouse Address:',
    }),
    addressBody: TextArea({
      label: 'Address lines (one per row)',
      defaultValue:
        'Exhibiting Company Name / Booth #\nc/o GES Logistics\n1234 Advance Warehouse Way\nCity, State ZIP\nUSA',
    }),
    hoursTitle: TextInput({
      label: 'Hours subtitle (optional)',
      defaultValue: 'Advanced Warehouse Hours:',
    }),
    hoursLine: TextInput({
      label: 'Hours line (optional)',
      defaultValue: 'M-F 8:00 AM to 4:00 PM',
    }),
    notes: Slot({
      unstable_placeholder: { builderOnly: true },
    }),
  },
});
