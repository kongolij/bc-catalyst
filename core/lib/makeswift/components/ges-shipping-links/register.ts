import { Group, List, Select, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesShippingLinksClient } from './client';

runtime.registerComponent(GesShippingLinksClient, {
  type: 'ges-shipping-links',
  label: 'GES / Blocks / Shipping Links',
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
    title: TextInput({
      label: 'Title (manual mode)',
      defaultValue: 'Shipping and Material Handling',
    }),
    description: TextArea({
      label: 'Description (manual mode)',
      defaultValue:
        'Get your materials to the show floor safely and on time. Our comprehensive shipping services ensure your booth materials arrive when you need them.',
    }),
    links: List({
      label: 'Links (manual mode)',
      type: Group({
        label: 'Link',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Get a Shipping Quote' }),
          href: TextInput({ label: 'URL', defaultValue: '#' }),
        },
      }),
      getItemLabel: (l) => l?.label || 'Link',
    }),
  },
});
