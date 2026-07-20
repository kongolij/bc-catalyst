import { Checkbox, Group, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { DatesDeadlinesClient } from './client';

const inlineSlot = () =>
  Slot({
    unstable_placeholder: {
      builderOnly: true,
    },
  });

const dateRow = (defaults: {
  startDate: string;
  endDate: string;
  scheduleType: string;
  scheduleNotes: string;
}) =>
  Group({
    label: defaults.scheduleType || 'Date',
    preferredLayout: 'makeswift::controls::group::layout::popover',
    props: {
      startDate: TextInput({ label: 'Start (YYYY-MM-DD)', defaultValue: defaults.startDate }),
      endDate: TextInput({ label: 'End (YYYY-MM-DD)', defaultValue: defaults.endDate }),
      scheduleType: TextInput({ label: 'Type', defaultValue: defaults.scheduleType }),
      scheduleNotes: TextInput({ label: 'Notes', defaultValue: defaults.scheduleNotes }),
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
      label: 'Load dates from live API (turn off to edit the seeded values below)',
      defaultValue: true,
    }),
    date1: dateRow({
      startDate: '2026-08-10',
      endDate: '2026-08-12',
      scheduleType: 'Move-In',
      scheduleNotes: 'Exhibitor move-in and booth setup',
    }),
    date2: dateRow({
      startDate: '2026-08-13',
      endDate: '2026-08-15',
      scheduleType: 'Show Days',
      scheduleNotes: 'Show open to attendees, 9:00 AM – 6:00 PM',
    }),
    date3: dateRow({
      startDate: '2026-08-16',
      endDate: '2026-08-16',
      scheduleType: 'Move-Out',
      scheduleNotes: 'All exhibitors must vacate by 6:00 PM',
    }),
    date4: dateRow({
      startDate: '2026-08-01',
      endDate: '2026-08-01',
      scheduleType: 'Freight Deadline',
      scheduleNotes: 'Last day for discounted advance warehouse shipments',
    }),
    extraContent: inlineSlot(),
  },
});
