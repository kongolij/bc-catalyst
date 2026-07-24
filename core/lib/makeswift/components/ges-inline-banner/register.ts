import { Color, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesInlineBannerClient } from './client';

runtime.registerComponent(GesInlineBannerClient, {
  type: 'ges-inline-banner',
  label: 'GES / Banners / Inline',
  icon: 'text',
  props: {
    className: Style(),
    text: TextInput({
      label: 'Text',
      defaultValue: 'Build a Better Booth, For a Better Price. Shop Exhibit Systems + Now',
    }),
    href: TextInput({ label: 'Link URL (optional)', defaultValue: '' }),
    background: Color({ label: 'Background color', defaultValue: '#c8d629' }),
    textColor: Color({ label: 'Text color', defaultValue: '#0a2540' }),
  },
});
