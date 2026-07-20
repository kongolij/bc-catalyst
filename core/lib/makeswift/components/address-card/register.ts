import { Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { AddressCardClient } from './client';

runtime.registerComponent(AddressCardClient, {
  type: 'ges-address-card',
  label: 'GES / Address Card',
  icon: 'carousel',
  props: {
    className: Style(),
    title: TextInput({ label: 'Title', defaultValue: 'Address Title' }),
    body: TextArea({
      label: 'Address lines (one per row)',
      defaultValue: 'Company / Booth #\nc/o GES\nStreet address\nCity, State ZIP\nCountry',
    }),
    notes: TextArea({ label: 'Notes (optional)' }),
  },
});
