import { Checkbox, Group, List, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { DatesDeadlinesClient } from './client';

const inlineSlot = () =>
  Slot({
    unstable_placeholder: {
      builderOnly: true,
    },
  });

runtime.registerComponent(DatesDeadlinesClient, {
  type: 'ges-dates-deadlines',
  label: 'GES / Dates & Deadlines',
  icon: 'carousel',
  props: {
    className: Style(),
    header: inlineSlot(),
    description: inlineSlot(),
    useApiDates: Checkbox({
      label: 'Load dates from API (turn off to use manual list; if empty, API data is still shown)',
      defaultValue: true,
    }),
    manualDates: List({
      label: 'Manual dates (overrides API when populated)',
      type: Group({
        label: 'Date',
        props: {
          startDate: TextInput({ label: 'Start (YYYY-MM-DD)', defaultValue: '' }),
          endDate: TextInput({ label: 'End (YYYY-MM-DD)', defaultValue: '' }),
          scheduleType: TextInput({ label: 'Type', defaultValue: '' }),
          scheduleNotes: TextInput({ label: 'Notes', defaultValue: '' }),
        },
      }),
      getItemLabel(item) {
        return item?.scheduleType || 'Date';
      },
    }),
  },
});
