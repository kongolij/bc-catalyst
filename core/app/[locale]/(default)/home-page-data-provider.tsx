import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { getFormatter } from 'next-intl/server';
import { type PropsWithChildren } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { getSessionCustomerAccessToken } from '~/auth';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { MakeswiftHomePageDataProvider } from '~/lib/makeswift/components/home-page/data-context';

import { getPageData } from './page-data';

export async function HomePageDataProvider({ children }: PropsWithChildren) {
  const format = await getFormatter();

  const streamablePageData = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const currencyCode = await getPreferredCurrencyCode();

    return getPageData(currencyCode, customerAccessToken);
  });

  const streamableFeaturedProducts = Streamable.from(async () => {
    const data = await streamablePageData;

    const featuredProducts = removeEdgesAndNodes(data.site.featuredProducts);

    return productCardTransformer(featuredProducts, format);
  });

  const streamableNewestProducts = Streamable.from(async () => {
    const data = await streamablePageData;

    const newestProducts = removeEdgesAndNodes(data.site.newestProducts);

    return productCardTransformer(newestProducts, format);
  });

  return (
    <MakeswiftHomePageDataProvider
      value={{
        featuredProducts: streamableFeaturedProducts,
        newestProducts: streamableNewestProducts,
      }}
    >
      {children}
    </MakeswiftHomePageDataProvider>
  );
}
