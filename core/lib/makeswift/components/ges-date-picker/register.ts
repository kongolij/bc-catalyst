import { Checkbox, Color, Combobox, Group, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesDatePickerClient } from './client';

const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function buildDateOptions(query: string) {
  const search = query.trim().toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 365);
  const options: Array<{ id: string; label: string; value: string }> = [];

  for (let offset = 0; offset < 365 + 730; offset += 1) {
    const cursor = new Date(start);
    cursor.setDate(start.getDate() + offset);
    const iso = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`;
    const weekday = WEEKDAYS_SHORT[cursor.getDay()];
    const label = `${weekday}, ${MONTHS_LONG[cursor.getMonth()]} ${cursor.getDate()}, ${cursor.getFullYear()}  (${iso})`;

    if (!search || label.toLowerCase().includes(search) || iso.includes(search)) {
      options.push({ id: iso, label, value: iso });
    }

    if (options.length >= 60) break;
  }

  return options;
}

runtime.registerComponent(GesDatePickerClient, {
  type: 'ges-date-picker',
  label: 'GES / UI / Date Picker',
  description:
    'Editor picks a date via a native calendar in the canvas. Renders a formatted date with an optional mini calendar visual and label.',
  icon: 'text',
  props: {
    className: Style(),
    picked: Combobox({
      label: 'Pick a date',
      getOptions: (query: string) => buildDateOptions(query),
    }),
    manualValue: TextInput({
      label: 'Or type a date (YYYY-MM-DD)',
      description: 'Overrides the picker above when set. Handy for dates outside the +/- 2 year range.',
      defaultValue: '',
    }),
    label: TextInput({
      label: 'Label (optional)',
      defaultValue: '',
    }),
    display: Group({
      label: 'Display',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        format: Select({
          label: 'Date format',
          options: [
            { label: 'Long — August 15, 2026', value: 'long' },
            { label: 'Medium — Aug 15, 2026', value: 'medium' },
            { label: 'Short — 08/15/2026', value: 'short' },
            { label: 'ISO — 2026-08-15', value: 'iso' },
          ],
          defaultValue: 'long',
        }),
        showCalendar: Checkbox({ label: 'Show mini calendar visual', defaultValue: true }),
        showIcon: Checkbox({ label: 'Show calendar icon', defaultValue: false }),
      },
    }),
    appearance: Group({
      label: 'Appearance',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        background: Color({ label: 'Background', defaultValue: '#ffffff' }),
        border: Color({ label: 'Border', defaultValue: '#dce2e6' }),
        text: Color({ label: 'Text', defaultValue: '#0a2536' }),
        accent: Color({ label: 'Accent (day + month band)', defaultValue: '#0e3d5b' }),
      },
    }),
  },
});
