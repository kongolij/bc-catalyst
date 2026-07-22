import { Color, Number as NumberControl, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesImportantDatesClient } from './client';

runtime.registerComponent(GesImportantDatesClient, {
  type: 'ges-important-dates',
  label: 'GES / Important Dates',
  icon: 'text',
  props: {
    className: Style(),
    title: TextInput({ label: 'Section title', defaultValue: 'Important Dates' }),
    countdownLabel: TextInput({
      label: 'Countdown label (uses {label} placeholder)',
      defaultValue: 'Days Until {label}',
    }),
    countdownBg: Color({ label: 'Countdown background', defaultValue: '#c8d629' }),
    countdownText: Color({ label: 'Countdown text', defaultValue: '#0a2540' }),
    maxRows: NumberControl({
      label: 'Max rows to show',
      defaultValue: 3,
      min: 1,
      max: 10,
      step: 1,
    }),
    calendarLinkLabel: TextInput({
      label: 'Calendar link label',
      defaultValue: '+ Add Dates to Calendar',
    }),
  },
});
