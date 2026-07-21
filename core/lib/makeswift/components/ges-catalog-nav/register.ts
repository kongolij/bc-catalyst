import { Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesCatalogNavClient } from './client';

runtime.registerComponent(GesCatalogNavClient, {
  type: 'ges-catalog-nav',
  label: 'GES / Catalog Nav (API)',
  icon: 'navigation',
  props: {
    className: Style(),
  },
});
