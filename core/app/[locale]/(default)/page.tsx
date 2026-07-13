import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { getFormatter, setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { getSessionCustomerAccessToken } from '~/auth';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { client } from '~/lib/makeswift/client';
import { MakeswiftHomePage } from '~/lib/makeswift/components/home-page/client';
import { MakeswiftHomePageDataProvider } from '~/lib/makeswift/components/home-page/data-context';

import { getPageData } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const format = await getFormatter();
  const siteVersion = await getSiteVersion();
  const makeswiftSnapshot = await client.getPageSnapshot('/', {
    siteVersion,
    locale,
    allowLocaleFallback: true,
  });

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
      {makeswiftSnapshot ? <MakeswiftPage snapshot={makeswiftSnapshot} /> : <MakeswiftHomePage />}
    </MakeswiftHomePageDataProvider>
  );
}
