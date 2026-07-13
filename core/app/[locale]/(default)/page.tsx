import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { setRequestLocale } from 'next-intl/server';

import { client } from '~/lib/makeswift/client';
import { MakeswiftHomePage } from '~/lib/makeswift/components/home-page/client';

import { HomePageDataProvider } from './home-page-data-provider';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const siteVersion = await getSiteVersion();
  const makeswiftSnapshot = await client.getPageSnapshot('/', {
    siteVersion,
    locale,
    allowLocaleFallback: true,
  });

  return (
    <HomePageDataProvider>
      {makeswiftSnapshot ? <MakeswiftPage snapshot={makeswiftSnapshot} /> : <MakeswiftHomePage />}
    </HomePageDataProvider>
  );
}
