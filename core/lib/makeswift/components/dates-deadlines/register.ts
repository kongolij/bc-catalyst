import { Group, Select, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { DatesDeadlinesClient } from './client';

const overrideRow = (label: string) =>
  Group({
    label,
    preferredLayout: 'makeswift::controls::group::layout::popover',
    props: {
      startDate: TextInput({ label: 'Start override (YYYY-MM-DD)' }),
      endDate: TextInput({ label: 'End override (YYYY-MM-DD)' }),
      scheduleType: TextInput({ label: 'Type override' }),
      scheduleNotes: TextInput({ label: 'Notes override' }),
    },
  });

runtime.registerComponent(DatesDeadlinesClient, {
  type: 'ges-dates-deadlines',
  label: 'GES / Dates & Deadlines',
  icon: 'carousel',
  props: {
    className: Style(),
    title: TextInput({
      label: 'Section title',
      defaultValue: 'Important Dates and Deadlines',
    }),
    titleVariant: Select({
      label: 'Title style',
      options: [
        { label: 'Section Heading (H2)', value: 'h2' },
        { label: 'Page Heading (H1)', value: 'h1' },
        { label: 'Sub-heading (H3)', value: 'h3' },
        { label: 'Eyebrow', value: 'eyebrow' },
      ],
      defaultValue: 'h2',
    }),
    description: TextArea({ label: 'Description (leave empty to hide)' }),
    date1Override: overrideRow('Row 1 override'),
    date2Override: overrideRow('Row 2 override'),
    date3Override: overrideRow('Row 3 override'),
    date4Override: overrideRow('Row 4 override'),
  },
});
