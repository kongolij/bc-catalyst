import { Group, List, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesShowTimelineClient } from './client';

runtime.registerComponent(GesShowTimelineClient, {
  type: 'ges-show-timeline',
  label: 'GES / Show Timeline',
  icon: 'carousel',
  props: {
    className: Style(),
    title: TextInput({ label: 'Section title', defaultValue: 'Show Timeline' }),
    viewLinkLabel: TextInput({
      label: 'Schedule link text',
      defaultValue: 'View Full Schedule',
    }),
    viewLinkUrl: TextInput({ label: 'Schedule link URL', defaultValue: '' }),
    mode: Select({
      label: 'Source',
      options: [
        { value: 'auto', label: 'Auto (from API)' },
        { value: 'manual', label: 'Manual (use events list below)' },
      ],
      defaultValue: 'auto',
    }),
    events: List({
      label: 'Events (used in Manual mode)',
      type: Group({
        label: 'Event',
        props: {
          day: TextInput({ label: 'Day', defaultValue: '1' }),
          month: TextInput({ label: 'Month (short)', defaultValue: 'SEPTEMBER' }),
          labels: List({
            label: 'Labels (multiple = combined items sharing this date)',
            type: Group({
              label: 'Label',
              props: {
                text: TextInput({ label: 'Text', defaultValue: 'Event name' }),
              },
            }),
            getItemLabel: (l) => l?.text || 'Label',
          }),
        },
      }),
      getItemLabel: (e) => (e ? `${e.day} ${e.month}` : 'Event'),
    }),
  },
});
