import { Checkbox, Group, List, Slot, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { fromApiControl, breadcrumbsSchema } from '../_shared/schemas';
import { ContactUsClient } from './client';

runtime.registerComponent(ContactUsClient, {
  type: 'contact-us-page',
  label: 'GES / Contact Us Page',
  icon: 'layout',
  hidden: true,
  props: {
    contactUsData: Group({
      label: 'Contact Us Data',
      props: {
        contactUsTitleData: Group({
          label: 'Title Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Contact Us' }),
          },
        }),

        breadcrumbsData: breadcrumbsSchema,

        toolTipData: Group({
          label: 'Tool Tip Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            hideContent: Checkbox({ label: 'Hide Content', defaultValue: false }),
            toolTipContent: Slot(),
          },
        }),

        callUsData: Group({
          label: 'Call Us Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            hideContent: Checkbox({ label: 'Hide Content', defaultValue: false }),
            callUsContent: Slot(),
          },
        }),

        chatOnlineData: Group({
          label: 'Chat Online Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            hideContent: Checkbox({ label: 'Hide Content', defaultValue: false }),
            chatOnlineContent: Slot(),
          },
        }),

        addressData: Group({
          label: 'Address Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            hideContent: Checkbox({ label: 'Hide Content', defaultValue: false }),
            addressContent: Slot(),
          },
        }),
      },
    }),
  },
});
