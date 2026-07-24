import { Group, List, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GESBreadcrumbs } from './client';

runtime.registerComponent(GESBreadcrumbs, {
  type: 'ges-breadcrumbs',
  label: 'GES / Primitives / Breadcrumbs',
  icon: 'navigation',
  props: {
    breadcrumbs: List({
      label: 'Breadcrumbs',
      type: Group({
        label: 'Breadcrumb item',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Home' }),
          href: TextInput({ label: 'URL', defaultValue: '/' }),
        },
      }),
      getItemLabel(item) {
        return item?.label ?? 'Breadcrumb item';
      },
    }),
  },
});
