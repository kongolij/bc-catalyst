import { Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

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
