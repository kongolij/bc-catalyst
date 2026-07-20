import { Group, Select, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { ShippingAddressesClient } from './client';

const overrideRow = (label: string) =>
  Group({
    label,
    preferredLayout: 'makeswift::controls::group::layout::popover',
    props: {
      title: TextInput({ label: 'Title override (leave empty to use API value)' }),
      body: TextArea({
        label: 'Address override — one line per row (leave empty to use API value)',
      }),
      notes: TextArea({ label: 'Notes override (leave empty to use API value)' }),
    },
  });

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
    address1Override: overrideRow('Address 1 override'),
    address2Override: overrideRow('Address 2 override'),
  },
});
