import { Checkbox, Group, List, Slot, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { ShippingAddressesClient } from './client';

const inlineSlot = () =>
  Slot({
    unstable_placeholder: {
      builderOnly: true,
    },
  });

const addressRow = (defaults: { title: string; lines: string[]; notes: string }) =>
  Group({
    label: defaults.title || 'Address',
    preferredLayout: 'makeswift::controls::group::layout::popover',
    props: {
      title: TextInput({ label: 'Title', defaultValue: defaults.title }),
      line1: TextInput({ label: 'Line 1', defaultValue: defaults.lines[0] ?? '' }),
      line2: TextInput({ label: 'Line 2', defaultValue: defaults.lines[1] ?? '' }),
      line3: TextInput({ label: 'Line 3', defaultValue: defaults.lines[2] ?? '' }),
      line4: TextInput({ label: 'Line 4', defaultValue: defaults.lines[3] ?? '' }),
      line5: TextInput({ label: 'Line 5', defaultValue: defaults.lines[4] ?? '' }),
      extraLines: List({
        label: 'Extra lines',
        type: TextInput({ label: 'Line', defaultValue: '' }),
      }),
      notes: TextArea({ label: 'Notes', defaultValue: defaults.notes }),
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
      label: 'Load addresses from live API (turn off to edit the seeded values below)',
      defaultValue: true,
    }),
    address1: addressRow({
      title: 'Advance Warehouse Address',
      lines: [
        'Exhibiting Company Name / Booth #',
        'c/o GES Logistics',
        '1234 Advance Warehouse Way',
        'Las Vegas, NV 89109',
        'USA',
      ],
      notes: 'Deliveries accepted Mon–Fri, 8:00 AM – 4:00 PM. Discount deadline: 2026-08-01.',
    }),
    address2: addressRow({
      title: 'Show Site Address',
      lines: [
        'Exhibiting Company Name / Booth #',
        'c/o GES @ Las Vegas Convention Center',
        '3150 Paradise Rd',
        'Las Vegas, NV 89109',
        'USA',
      ],
      notes: 'Direct-to-show shipments accepted starting 2026-08-10 at 7:00 AM.',
    }),
    extraContent: inlineSlot(),
  },
});
