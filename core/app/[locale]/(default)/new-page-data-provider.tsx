import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { getFormatter } from 'next-intl/server';
import { type PropsWithChildren } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { getSessionCustomerAccessToken } from '~/auth';
import {
  productCardTransformer,
  singleProductCardTransformer,
} from '~/data-transformers/product-card-transformer';
import { MakeswiftNewPageDataProvider } from '~/lib/makeswift/components/new-page/data-context';

import { getNewPageData } from './new-page-data';

interface Props {
  id: string;
}

export async function NewPageDataProvider({ children, id }: PropsWithChildren<Props>) {
  const format = await getFormatter();
  const entityId = Number(id);

  const streamableProduct = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const product = await getNewPageData(entityId, customerAccessToken);

    return product ? singleProductCardTransformer(product, format) : null;
  });

  const streamableRelated = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const product = await getNewPageData(entityId, customerAccessToken);

    if (!product) return [];

    return productCardTransformer(removeEdgesAndNodes(product.relatedProducts), format);
  });

  return (
    <MakeswiftNewPageDataProvider
      value={{
        id,
        featuredProduct: streamableProduct,
        relatedProducts: streamableRelated,
      }}
    >
      {children}
    </MakeswiftNewPageDataProvider>
  );
}
