import { Color, Group, Image, List, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesSplitBannerClient } from './client';

runtime.registerComponent(GesSplitBannerClient, {
  type: 'ges-split-banner',
  label: 'GES / Split Banner',
  icon: 'carousel',
  props: {
    className: Style(),
    panels: List({
      label: 'Panels',
      type: Group({
        label: 'Panel',
        props: {
          background: Color({ label: 'Background color', defaultValue: '#c8d629' }),
          textColor: Color({ label: 'Text color', defaultValue: '#0a2540' }),
          imageUrl: Image({ label: 'Image (optional)' }),
          imageAlt: TextInput({ label: 'Image alt', defaultValue: '' }),
          title: TextInput({ label: 'Title', defaultValue: 'Stand out with Custom Rentals' }),
          body: TextArea({
            label: 'Body',
            defaultValue:
              'Get successful, customized solutions that showcase your products & services, drive engagement and generate high-quality leads.',
          }),
          buttonLabel: TextInput({ label: 'Button label', defaultValue: 'Learn more' }),
          buttonHref: TextInput({ label: 'Button URL', defaultValue: '' }),
          buttonBg: Color({ label: 'Button background', defaultValue: '#0a2540' }),
          buttonText: Color({ label: 'Button text color', defaultValue: '#ffffff' }),
        },
      }),
      getItemLabel: (p) => p?.title || 'Panel',
    }),
  },
});
