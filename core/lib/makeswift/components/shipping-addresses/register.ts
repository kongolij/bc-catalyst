import { Checkbox, Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { ShippingAddressesClient } from './client';

runtime.registerComponent(ShippingAddressesClient, {
  type: 'ges-shipping-addresses',
  label: 'GES / Shipping Addresses',
  icon: 'carousel',
  props: {
    className: Style(),
    title: TextInput({ label: 'Section title', defaultValue: 'Shipping Addresses' }),
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
    useApiAddresses: Checkbox({
      label: 'Load addresses from live API (turn off to edit content directly on the canvas below)',
      defaultValue: true,
    }),
    manualContent: Slot({
      unstable_placeholder: { builderOnly: true },
    }),
  },
});
