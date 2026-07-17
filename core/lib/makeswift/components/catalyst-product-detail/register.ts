import { Combobox, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';
import { searchProducts } from '~/lib/makeswift/utils/search-products';

import { MakeswiftCatalystProductDetail } from './client';

runtime.registerComponent(MakeswiftCatalystProductDetail, {
  type: 'catalog-catalyst-product-detail',
  label: 'Catalog / Product Detail (Catalyst)',
  props: {
    className: Style(),
    previewProductId: Combobox({
      label: 'Preview product (editor only)',
      async getOptions(query) {
        // eslint-disable-next-line no-console
        console.log('[catalyst-product-detail combobox] getOptions', { query });

        const products = await searchProducts(query);

        // eslint-disable-next-line no-console
        console.log('[catalyst-product-detail combobox] mapped', { count: products.length });

        return products.map((product) => ({
          id: product.entityId.toString(),
          label: product.name,
          value: product.entityId.toString(),
        }));
      },
    }),
  },
});
