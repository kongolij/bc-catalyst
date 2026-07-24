import { Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { PrintButton } from './client';

runtime.registerComponent(PrintButton, {
  type: 'print-button',
  label: 'GES / Buttons / Print',
  props: {
    className: Style(),
  },
});
