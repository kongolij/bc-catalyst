import { Checkbox, Group, Image, List, Slot, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { breadcrumbsSchema, fromApiControl } from '../_shared/schemas';
import { DateScheduleClient } from './client';

const importantDatesListControl = List({
  label: 'Important Dates List',
  type: Group({
    label: 'Date Item',
    props: {
      startDate: TextInput({ label: 'Start Date (UTC)', defaultValue: new Date().toISOString() }),
      endDate: TextInput({ label: 'End Date (UTC)', defaultValue: new Date().toISOString() }),
      scheduleType: TextInput({ label: 'Schedule Type', defaultValue: '' }),
      scheduleNotes: TextInput({ label: 'Schedule Notes', defaultValue: '' }),
      includeInCalender: Checkbox({ label: 'Include in Calendar?', defaultValue: true }),
      showInList: Checkbox({ label: 'Show in List?', defaultValue: true }),
    },
  }),
  getItemLabel(item) {
    return item?.scheduleNotes ?? 'Date Item';
  },
});

runtime.registerComponent(DateScheduleClient, {
  type: 'date-schedule-page',
  label: 'GES / Pages / Date Schedule',
  icon: 'layout',
  hidden: true,
  props: {
    dateScheduleData: Group({
      label: 'Date Schedule Data',
      props: {
        bannerData: Group({
          label: 'Banner Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: '' }),
            description: TextInput({ label: 'Description', defaultValue: '' }),
            showBannerLogo: Checkbox({ label: 'Show Banner Logo?', defaultValue: false }),
            bannerLogo: Image({ label: 'Banner Logo', format: Image.Format.WithDimensions }),
          },
        }),

        breadcrumbsData: breadcrumbsSchema,

        contentData: Group({
          label: 'Content Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: '' }),
            messageData: Slot(),
          },
        }),

        importantDatesDeadlineData: Group({
          label: 'Important Dates & Deadlines',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            importantDatesList: importantDatesListControl,
          },
        }),
      },
    }),
  },
});
