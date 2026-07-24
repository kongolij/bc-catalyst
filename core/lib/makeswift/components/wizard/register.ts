import { Checkbox, Group, List, Slot, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { WizardLanding } from './client';

runtime.registerComponent(WizardLanding, {
  type: 'wizard-product-page',
  label: 'GES / Pages / Wizard Product',
  icon: 'layout',
  hidden: true,
  props: {
    titleData: Group({
      label: 'Title Data',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        fromApi: Checkbox({ label: 'Data from API?', defaultValue: true }),
        title: TextInput({ label: 'Title', defaultValue: 'GES Wizard' }),
      },
    }),
    cardData: Group({
      label: 'Card Data',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        fromApi: Checkbox({ label: 'Data from API?', defaultValue: true }),
        cards: List({
          label: 'Cards',
          type: Group({
            label: 'Card Slot',
            props: {
              description: Slot(),
            },
          }),
          getItemLabel: (_) => 'Card Slot',
        }),
      },
    }),
    buttonData: Group({
      label: 'Button Data',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        fromApi: Checkbox({ label: 'Data from API?', defaultValue: true }),
        buttonName: TextInput({ label: 'Button Name', defaultValue: 'Start' }),
      },
    }),
  },
});
