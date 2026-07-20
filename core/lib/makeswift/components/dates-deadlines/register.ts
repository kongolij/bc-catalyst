import { Checkbox, Slot, Style } from '@makeswift/runtime/controls';

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
      label: 'Load dates from API (turn off to edit content in-place below)',
      defaultValue: true,
    }),
    manualContent: inlineSlot(),
  },
});
