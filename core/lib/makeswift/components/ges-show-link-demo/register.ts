import { Link, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesShowLinkDemoClient } from './client';

// Test-only component for the show-link helper.
// To enable, add to lib/makeswift/components/index.ts: import './ges-show-link-demo/register';
runtime.registerComponent(GesShowLinkDemoClient, {
  type: 'ges-show-link-demo',
  label: 'Test / Show Link Demo',
  icon: 'text',
  props: {
    className: Style(),
    text: TextInput({ label: 'Text', defaultValue: 'Move-in info' }),
    link: Link({ label: 'Link' }),
    // Leave empty to use the project_code cookie, as on a real show site.
    fakeShowCode: TextInput({ label: 'Fake show code (test only)', defaultValue: '' }),
  },
});
