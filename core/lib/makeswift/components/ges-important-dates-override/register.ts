import {
  Checkbox,
  Color,
  Group,
  List,
  Number as NumberControl,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesImportantDatesOverrideClient } from './client';

runtime.registerComponent(GesImportantDatesOverrideClient, {
  type: 'ges-important-dates-override',
  label: 'GES / Important Dates (Override)',
  icon: 'text',
  props: {
    className: Style(),
    disableApi: Checkbox({
      label: 'Disable API (use manual entries only)',
      defaultValue: false,
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
      label: 'Manual entries (override or add)',
      type: Group({
        label: 'Entry',
        props: {
          matchId: TextInput({
            label: 'Override API id (leave empty to add a new row)',
            defaultValue: '',
          }),
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
      getItemLabel: (r) =>
        r?.matchId ? `Override: ${r.matchId}` : r?.scheduleType || r?.startDate || 'New entry',
    }),
    hiddenIds: List({
      label: 'Hide API rows by id',
      type: Group({
        label: 'Hidden id',
        props: {
          id: TextInput({ label: 'API row id to hide', defaultValue: '' }),
        },
      }),
      getItemLabel: (h) => h?.id || 'id',
    }),
  },
});
