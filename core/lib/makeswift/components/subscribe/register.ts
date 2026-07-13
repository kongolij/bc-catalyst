import { Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MSSubscribe } from './client';

runtime.registerComponent(MSSubscribe, {
  type: 'section-subscribe',
  label: 'Sections / Subscribe',
  icon: 'layout',
  props: {
    className: Style(),
  },
});
