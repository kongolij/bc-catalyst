import { Group, List, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesSelectableDatesClient } from './client';

runtime.registerComponent(GesSelectableDatesClient, {
  type: 'ges-selectable-dates',
  label: 'GES / Selectable Dates',
  icon: 'carousel',
  props: {
    className: Style(),
    source: Select({
      label: 'Data source',
      options: [
        { label: 'API (live show dates)', value: 'api' },
        { label: 'Manual (author rows below)', value: 'manual' },
      ],
      defaultValue: 'api',
    }),
    rows: List({
      label: 'Manual date rows',
      type: Group({
        label: 'Date row',
        props: {
          startDate: TextInput({ label: 'Start date (YYYY-MM-DD)' }),
          endDate: TextInput({ label: 'End date (YYYY-MM-DD, optional)' }),
          scheduleType: TextInput({ label: 'Type / label' }),
          scheduleNotes: TextInput({ label: 'Notes (optional)' }),
        },
      }),
      getItemLabel: (r) => r?.scheduleType || r?.startDate || 'Date row',
    }),
    calendarFileName: TextInput({ label: 'Calendar filename', defaultValue: 'ges-dates.ics' }),
  },
});
