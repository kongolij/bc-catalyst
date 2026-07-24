import { Group, List, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { FindShow } from './client';

runtime.registerComponent(FindShow, {
  type: 'find-show',
  label: 'GES / Navigation / Find Show',
  props: {
    events: List({
      label: 'Events',
      type: Group({
        label: 'Event',
        props: {
          name: TextInput({ label: 'Event Name', defaultValue: '' }),
          location: TextInput({ label: 'Location', defaultValue: '' }),
          date: TextInput({ label: 'Date', defaultValue: '' }),
        },
      }),
      getItemLabel(event) {
        return event?.name || 'Event Item';
      },
    }),
  },
});
