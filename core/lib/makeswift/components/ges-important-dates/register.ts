import {
  Checkbox,
  Color,
  Group,
  List,
  Number as NumberControl,
  Select,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesImportantDatesClient } from './client';

runtime.registerComponent(GesImportantDatesClient, {
  type: 'ges-important-dates',
  label: 'GES / Blocks / Important Dates',
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
    manualRows: List({
      label: 'Manual dates',
      type: Group({
        label: 'Date row',
        props: {
          startDate: TextInput({
            label: 'Start date (ISO, e.g. 2026-08-09T08:00:00)',
            defaultValue: '',
          }),
          endDate: TextInput({
            label: 'End date (ISO)',
            defaultValue: '',
          }),
          scheduleType: TextInput({
            label: 'Label (e.g. Exhibitor Move-in)',
            defaultValue: '',
          }),
          scheduleNotes: TextInput({ label: 'Notes', defaultValue: '' }),
          isCountdownTarget: Checkbox({
            label: 'Use as countdown target?',
            defaultValue: false,
          }),
        },
      }),
      getItemLabel: (r) => r?.scheduleType || r?.startDate || 'Date row',
    }),
  },
});
