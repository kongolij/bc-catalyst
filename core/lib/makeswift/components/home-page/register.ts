import { Slot } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftHomePage } from './client';

runtime.registerComponent(MakeswiftHomePage, {
  type: 'ges-home-page-template',
  label: 'GES / Home Page Template',
  props: {
    top: Slot(),
    afterHero: Slot(),
    middle: Slot(),
    belowNewest: Slot(),
    bottom: Slot(),
  },
});
