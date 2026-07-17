import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { notFound } from 'next/navigation';

import { client } from '~/lib/makeswift/client';

import { HomePageDataProvider } from '../home-page-data-provider';

interface Props {
  params: Promise<{ locale: string; rest: string[] }>;
}

export async function generateStaticParams() {
  const pages = await client.getPages().toArray();

  return pages.map((page) => ({
    rest: page.path.replace(/^\//, '').split('/').filter(Boolean),
  }));
}

export default async function CatchAllPage({ params }: Props) {
  const { rest, locale } = await params;
  const pathname = '/' + rest.join('/');

  const lastSegment = rest[rest.length - 1] ?? '';

  if (lastSegment.includes('.')) {
    notFound();
  }

  let snapshot: Awaited<ReturnType<typeof client.getPageSnapshot>> | null = null;

  try {
    snapshot = await client.getPageSnapshot(pathname, {
      siteVersion: await getSiteVersion(),
      locale,
      allowLocaleFallback: true,
    });
  } catch (err) {
    console.warn('[makeswift catch-all] snapshot lookup failed', { pathname, locale, err });
    notFound();
  }

  if (!snapshot) {
    console.warn('[makeswift catch-all] no snapshot for', { pathname, locale });
    notFound();
  }

  return (
    <HomePageDataProvider>
      <MakeswiftPage snapshot={snapshot} />
    </HomePageDataProvider>
  );
}
