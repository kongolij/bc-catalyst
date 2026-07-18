import { Slot, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftCartSlot } from './client';

export const CART_SLOT_TYPE = 'catalog-cart-slot';
export const CART_SLOT_SNAPSHOT_ID = 'cart-content-slot';

runtime.registerComponent(MakeswiftCartSlot, {
  type: CART_SLOT_TYPE,
  label: 'Catalog / Cart Slot',
  hidden: true,
  props: {
    className: Style(),
    content: Slot({
      unstable_placeholder: {
        builderOnly: true,
      },
    }),
  },
});
