import { Checkbox, Group, Slot, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { ShippingAddressesClient } from './client';

const inlineSlot = () =>
  Slot({
    unstable_placeholder: {
      builderOnly: true,
    },
  });

const addressRow = (defaults: { title: string; body: string; notes: string }) =>
  Group({
    label: defaults.title || 'Address',
    preferredLayout: 'makeswift::controls::group::layout::popover',
    props: {
      title: TextInput({ label: 'Title', defaultValue: defaults.title }),
      body: TextArea({
        label: 'Address (free text — one line per row)',
        defaultValue: defaults.body,
      }),
      notes: TextArea({ label: 'Notes (optional)', defaultValue: defaults.notes }),
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
      label: 'Load addresses from live API (turn off to freely edit the seeded values below)',
      defaultValue: true,
    }),
    address1: addressRow({
      title: 'Advance Warehouse Address',
      body: [
        'Exhibiting Company Name / Booth #',
        'c/o GES Logistics',
        '1234 Advance Warehouse Way',
        'Las Vegas, NV 89109',
        'USA',
      ].join('\n'),
      notes: 'Deliveries accepted Mon–Fri, 8:00 AM – 4:00 PM. Discount deadline: 2026-08-01.',
    }),
    address2: addressRow({
      title: 'Show Site Address',
      body: [
        'Exhibiting Company Name / Booth #',
        'c/o GES @ Las Vegas Convention Center',
        '3150 Paradise Rd',
        'Las Vegas, NV 89109',
        'USA',
      ].join('\n'),
      notes: 'Direct-to-show shipments accepted starting 2026-08-10 at 7:00 AM.',
    }),
    extraContent: inlineSlot(),
  },
});
