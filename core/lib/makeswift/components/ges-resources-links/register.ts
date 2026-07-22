import { Group, List, Number as NumberControl, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesResourcesLinksClient } from './client';

runtime.registerComponent(GesResourcesLinksClient, {
  type: 'ges-resources-links',
  label: 'GES / Resources and Information',
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
      defaultValue: 'Resources and Information',
    }),
    columns: NumberControl({
      label: 'Columns',
      defaultValue: 2,
      min: 1,
      max: 4,
      step: 1,
    }),
    links: List({
      label: 'Links (manual mode)',
      type: Group({
        label: 'Link',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Link' }),
          href: TextInput({ label: 'URL', defaultValue: '#' }),
        },
      }),
      getItemLabel: (l) => l?.label || 'Link',
    }),
  },
});
