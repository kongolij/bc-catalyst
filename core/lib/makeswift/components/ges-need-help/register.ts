import { Group, List, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesNeedHelpClient } from './client';

runtime.registerComponent(GesNeedHelpClient, {
  type: 'ges-need-help',
  label: 'GES / Blocks / Need Help',
  icon: 'text',
  props: {
    className: Style(),
    source: Select({
      label: 'Content source',
      options: [
        { label: 'Load from API', value: 'api' },
        { label: 'Manual', value: 'manual' },
      ],
      defaultValue: 'api',
    }),
    title: TextInput({ label: 'Title (manual mode)', defaultValue: 'Need Help?' }),
    contacts: List({
      label: 'Contacts (manual mode)',
      type: Group({
        label: 'Contact',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Customer Service' }),
          number: TextInput({ label: 'Phone number', defaultValue: '(800) 000-0000' }),
        },
      }),
      getItemLabel: (c) => c?.label || 'Contact',
    }),
  },
});
