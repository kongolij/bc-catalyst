import {
  Checkbox,
  Color,
  Combobox,
  Group,
  List,
  Number as NumberControl,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesImportantDatesOverrideClient } from './client';

async function fetchApiRowOptions(query: string) {
  try {
    const res = await fetch('/api/ges/quick-facts/dates');
    const data = (await res.json()) as {
      dates: Array<{ id?: string; scheduleType?: string; startDate?: string }>;
    };
    const q = (query ?? '').toLowerCase();
    return (data.dates ?? [])
      .filter((r) => r.id)
      .filter((r) =>
        q
          ? (r.id ?? '').toLowerCase().includes(q) ||
            (r.scheduleType ?? '').toLowerCase().includes(q)
          : true,
      )
      .map((r) => ({
        id: r.id!,
        label: `${r.scheduleType ?? r.id!} (${r.id!})`,
        value: r.id!,
      }));
  } catch {
    return [];
  }
}

runtime.registerComponent(GesImportantDatesOverrideClient, {
  type: 'ges-important-dates-override',
  label: 'GES / Important Dates (Override)',
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
    manualRows: List({
      label: 'Manual entries (override or add)',
      type: Group({
        label: 'Entry',
        props: {
          matchId: Combobox({
            label: 'Override API row (leave empty to add a new row)',
            getOptions: fetchApiRowOptions,
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
      getItemLabel: (r) => {
        const key = typeof r?.matchId === 'string' ? r.matchId : r?.matchId?.value;
        return key ? `Override: ${key}` : r?.scheduleType || r?.startDate || 'New entry';
      },
    }),
    hiddenIds: List({
      label: 'Hide API rows',
      type: Group({
        label: 'Hidden row',
        props: {
          id: Combobox({
            label: 'API row to hide',
            getOptions: fetchApiRowOptions,
          }),
        },
      }),
      getItemLabel: (h) => {
        const key = typeof h?.id === 'string' ? h.id : h?.id?.value;
        return key || 'row';
      },
    }),
  },
});
