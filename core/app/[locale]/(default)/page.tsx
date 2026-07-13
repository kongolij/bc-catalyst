import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { MakeswiftComponent } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { FeaturedProductCarousel } from '@/vibes/soul/sections/featured-product-carousel';
import { FeaturedProductList } from '@/vibes/soul/sections/featured-product-list';
import { getSessionCustomerAccessToken } from '~/auth';
import { Subscribe } from '~/components/subscribe';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { client } from '~/lib/makeswift/client';

import { Slideshow } from './_components/slideshow';
import { getPageData } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

const HOME_SLOTS = [
  { id: 'home-top', label: 'Home - Top' },
  { id: 'home-after-hero', label: 'Home - After Hero' },
  { id: 'home-middle', label: 'Home - Middle' },
  { id: 'home-below-newest', label: 'Home - Below Newest' },
  { id: 'home-bottom', label: 'Home - Bottom' },
] as const;

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const format = await getFormatter();

  const siteVersion = await getSiteVersion();

  const snapshots = await client.unstable_getComponentSnapshots(
    HOME_SLOTS.map(({ id }) => id),
    { siteVersion, locale, allowLocaleFallback: true },
  );

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
    <>
      <MakeswiftComponent
        label={HOME_SLOTS[0].label}
        snapshot={snapshots[0]!}
        type="layouts-section"
      />

      <Slideshow />

      <MakeswiftComponent
        label={HOME_SLOTS[1].label}
        snapshot={snapshots[1]!}
        type="layouts-section"
      />

      <FeaturedProductList
        cta={{ label: t('FeaturedProducts.cta'), href: '/shop-all' }}
        description={t('FeaturedProducts.description')}
        emptyStateSubtitle={t('FeaturedProducts.emptyStateSubtitle')}
        emptyStateTitle={t('FeaturedProducts.emptyStateTitle')}
        products={streamableFeaturedProducts}
        title={t('FeaturedProducts.title')}
      />

      <MakeswiftComponent
        label={HOME_SLOTS[2].label}
        snapshot={snapshots[2]!}
        type="layouts-section"
      />

      <FeaturedProductCarousel
        cta={{ label: t('NewestProducts.cta'), href: '/shop-all/?sort=newest' }}
        description={t('NewestProducts.description')}
        emptyStateSubtitle={t('NewestProducts.emptyStateSubtitle')}
        emptyStateTitle={t('NewestProducts.emptyStateTitle')}
        nextLabel={t('NewestProducts.nextProducts')}
        previousLabel={t('NewestProducts.previousProducts')}
        products={streamableNewestProducts}
        title={t('NewestProducts.title')}
      />

      <MakeswiftComponent
        label={HOME_SLOTS[3].label}
        snapshot={snapshots[3]!}
        type="layouts-section"
      />

      <Subscribe />

      <MakeswiftComponent
        label={HOME_SLOTS[4].label}
        snapshot={snapshots[4]!}
        type="layouts-section"
      />
    </>
  );
}
