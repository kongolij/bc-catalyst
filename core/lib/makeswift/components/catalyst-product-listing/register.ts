import { Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftCatalystProductListing } from './client';

runtime.registerComponent(MakeswiftCatalystProductListing, {
  type: 'catalog-catalyst-product-listing',
  label: 'Catalog / Product Listing (Catalyst)',
  description:
    'Marker for the route-driven product listing. Placement, spacing and surrounding content are editable; products, filters, sort and pagination are resolved by the search or category route.',
  icon: 'text',
  props: {
    className: Style(),
  },
});
