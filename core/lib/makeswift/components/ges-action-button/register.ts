import { Link, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesActionButtonClient } from './client';

runtime.registerComponent(GesActionButtonClient, {
  type: 'ges-action-button',
  label: 'GES / Action Button',
  icon: 'button',
  props: {
    className: Style(),
    label: TextInput({ label: 'Button label', defaultValue: 'Request a Quote' }),
    link: Link({ label: 'Link' }),
    variant: Select({
      label: 'Style',
      options: [
        { label: 'Primary (lime pill)', value: 'primary' },
        { label: 'Secondary (outline)', value: 'secondary' },
        { label: 'Link (text only)', value: 'link' },
      ],
      defaultValue: 'primary',
    }),
  },
});
