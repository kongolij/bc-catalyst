import { Slot } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftNewPage } from './client';

const optionalSlot = () =>
  Slot({
    unstable_placeholder: {
      builderOnly: true,
    },
  });

runtime.registerComponent(MakeswiftNewPage, {
  type: 'ges-new-page-template',
  label: 'GES / New Page Template',
  props: {
    header: optionalSlot(),
    middle: optionalSlot(),
    footer: optionalSlot(),
  },
});
