import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs/server';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/lib/makeswift/client';
import { buildCatalystProductContextValue } from '~/lib/makeswift/components/catalyst-product-detail/build-context-value';
import { CatalystProductProvider } from '~/lib/makeswift/components/catalyst-product-detail/provider';

import { HomePageDataProvider } from '../home-page-data-provider';

interface Props {
  params: Promise<{ locale: string; rest: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateStaticParams() {
  const pages = await client.getPages().toArray();

  return pages.map((page) => ({
    rest: page.path.replace(/^\//, '').split('/').filter(Boolean),
  }));
}

export default async function CatchAllPage({ params, searchParams }: Props) {
  const { rest } = await params;
  const pathname = '/' + rest.join('/');

  const resolvedSearchParams = await searchParams;
  const previewProductRaw =
    Object.entries(resolvedSearchParams).find(
      ([key]) => key.toLowerCase() === 'previewproduct',
    )?.[1] ?? undefined;
  const previewProductId = Array.isArray(previewProductRaw)
    ? previewProductRaw[0]
    : previewProductRaw;
  const previewProductNumber = previewProductId ? Number(previewProductId) : NaN;

  // Block direct browsing of the internal PDP template.
  // Allowed contexts: Makeswift editor (draft mode) OR ?previewProduct=<id>
  // (product/[slug] fetches the snapshot directly, not via this route).
  const isDraft = (await draftMode()).isEnabled;

  if (
    pathname === '/pdp-template' &&
    Number.isNaN(previewProductNumber) &&
    !isDraft
  ) {
    console.log('[catch-all] blocking direct /pdp-template browse');
    notFound();
  }

  const snapshot = await client.getPageSnapshot(pathname, {
    siteVersion: await getSiteVersion(),
  });

  console.log('[catch-all] snapshot lookup', { pathname, hasSnapshot: !!snapshot });

  if (!snapshot) notFound();

  console.log('[catch-all] preview branch check', {
    pathname,
    searchParamKeys: Object.keys(resolvedSearchParams),
    previewProductRaw,
    previewProductId,
    previewProductNumber,
    isPdpTemplate: pathname === '/pdp-template',
  });

  if (pathname === '/pdp-template' && !Number.isNaN(previewProductNumber)) {
    const customerAccessToken = await getSessionCustomerAccessToken();

    console.log('[catch-all] entering preview branch', {
      previewProductNumber,
      hasToken: !!customerAccessToken,
    });

    const contextValue = await buildCatalystProductContextValue({
      productId: previewProductNumber,
      customerAccessToken,
      searchParams,
    });

    console.log('[catch-all] built context value', {
      previewProductNumber,
      hasContextValue: !!contextValue,
      entityId: contextValue?.entityId,
    });

    if (contextValue) {
      return (
        <HomePageDataProvider>
          <CatalystProductProvider value={contextValue}>
            <MakeswiftPage snapshot={snapshot} />
          </CatalystProductProvider>
        </HomePageDataProvider>
      );
    }
  }

  return (
    <HomePageDataProvider>
      <MakeswiftPage snapshot={snapshot} />
    </HomePageDataProvider>
  );
}
