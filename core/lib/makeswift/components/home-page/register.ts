import { Slot } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftHomePage } from './client';

const optionalSlot = () =>
  Slot({
    unstable_placeholder: {
      builderOnly: true,
    },
  });

runtime.registerComponent(MakeswiftHomePage, {
  type: 'ges-home-page-template',
  label: 'GES / Pages / Home Template',
  props: {
    top: optionalSlot(),
    afterHero: optionalSlot(),
    middle: optionalSlot(),
    belowNewest: optionalSlot(),
    bottom: optionalSlot(),
  },
});
