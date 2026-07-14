import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { client } from '~/lib/makeswift/client';
import { MakeswiftNewPage } from '~/lib/makeswift/components/new-page/client';

import { NewPageDataProvider } from '../../../(default)/new-page-data-provider';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function NewPage({ params }: Props) {
  const { id, locale } = await params;

  setRequestLocale(locale);

  if (!/^\d+$/.test(id)) notFound();

  const snapshot = await client.getPageSnapshot(`/new-page-${id}`, {
    siteVersion: await getSiteVersion(),
    locale,
    allowLocaleFallback: true,
  });

  return (
    <NewPageDataProvider id={id}>
      {snapshot ? <MakeswiftPage snapshot={snapshot} /> : <MakeswiftNewPage />}
    </NewPageDataProvider>
  );
}
