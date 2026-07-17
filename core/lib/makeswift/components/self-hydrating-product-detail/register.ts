import { Checkbox, Combobox, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';
import { searchProducts } from '~/lib/makeswift/utils/search-products';

import { MakeswiftSelfHydratingProductDetail } from './client';

runtime.registerComponent(MakeswiftSelfHydratingProductDetail, {
  type: 'catalog-self-hydrating-product-detail',
  label: 'Catalog / Product Detail (Self-Hydrating)',
  props: {
    className: Style(),
    previewProductId: Combobox({
      label: 'Preview product (editor only)',
      async getOptions(query) {
        const products = await searchProducts(query);

        return products.map((product) => ({
          id: product.entityId.toString(),
          label: product.name,
          value: product.entityId.toString(),
        }));
      },
    }),
    showPrice: Checkbox({ label: 'Show price', defaultValue: true }),
    showDescription: Checkbox({ label: 'Show description', defaultValue: true }),
  },
});
