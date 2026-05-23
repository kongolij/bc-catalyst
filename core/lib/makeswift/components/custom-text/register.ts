import { RichText, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { CustomText } from './client';

runtime.registerComponent(CustomText, {
  type: 'belami-custom-text',
  label: 'Basic / Custom Text',
  icon: 'text',
  props: {
    headline: RichText(),
    className: Style({ properties: [Style.Margin, Style.Width] }),
  },
});
