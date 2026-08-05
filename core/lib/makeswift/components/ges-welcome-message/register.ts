import {
  Checkbox,
  Color,
  Group,
  Select,
  Slot,
  Style,
  TextArea,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesWelcomeMessageClient } from './client';

runtime.registerComponent(GesWelcomeMessageClient, {
  type: 'ges-welcome-message',
  label: 'GES / Content / Welcome Message',
  description:
    'Welcome message that defaults to the Show App API text. Publishers can override with a Makeswift rich-text block for headings, lists, links and emphasis.',
  icon: 'text',
  props: {
    className: Style(),
    source: Select({
      label: 'Content source',
      options: [
        { label: 'Show App API (default)', value: 'api' },
        { label: 'Makeswift content (override)', value: 'makeswift' },
      ],
      defaultValue: 'api',
    }),
    apiFallback: Group({
      label: 'Show App API',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        title: TextInput({
          label: 'Heading (blank hides heading)',
          defaultValue: 'Welcome to your show',
        }),
        body: TextArea({
          label: 'Default welcome message',
          defaultValue:
            'Thank you for exhibiting with GES. Use this portal to manage your booth, order services, review deadlines, and access resources for a successful show.',
        }),
      },
    }),
    content: Slot(),
    hideWhenEmpty: Checkbox({
      label: 'Hide component when there is no content',
      defaultValue: true,
    }),
    appearance: Group({
      label: 'Appearance',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        background: Color({ label: 'Background', defaultValue: '#ffffff' }),
        text: Color({ label: 'Text', defaultValue: '#0a2536' }),
        accent: Color({ label: 'Heading accent', defaultValue: '#0e3d5b' }),
        align: Select({
          label: 'Text alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
          defaultValue: 'left',
        }),
      },
    }),
  },
});
