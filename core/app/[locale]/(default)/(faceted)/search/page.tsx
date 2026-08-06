import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { client as makeswiftClient } from '~/lib/makeswift/client';
import { buildSearchProductListingContextValue } from '~/lib/makeswift/components/catalyst-product-listing/build-search-context-value';
import { CatalystProductListingProvider } from '~/lib/makeswift/components/catalyst-product-listing/provider';

const SEARCH_TEMPLATE_PATH = '/search-template';

async function getSearchTemplateSnapshot() {
  try {
    return await makeswiftClient.getPageSnapshot(SEARCH_TEMPLATE_PATH, {
      siteVersion: await getSiteVersion(),
    });
  } catch (err) {
    console.warn('[search template] failed to fetch snapshot', err);

    return null;
  }
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Faceted.Search' });

  return {
    title: t('title'),
  };
}

export default async function Search(props: Props) {
  const { locale } = await props.params;

  setRequestLocale(locale);

  const [searchTemplateSnapshot, listingContext] = await Promise.all([
    getSearchTemplateSnapshot(),
    buildSearchProductListingContextValue({ searchParams: props.searchParams }),
  ]);

  if (searchTemplateSnapshot && listingContext) {
    return (
      <CatalystProductListingProvider value={listingContext}>
        <MakeswiftPage snapshot={searchTemplateSnapshot} />
      </CatalystProductListingProvider>
    );
  }

  return listingContext?.productListing ?? null;
}
