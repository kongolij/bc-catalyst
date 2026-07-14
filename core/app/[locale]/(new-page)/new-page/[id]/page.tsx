import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { client } from '~/lib/makeswift/client';
import { MakeswiftNewPage } from '~/lib/makeswift/components/new-page/client';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function NewPage({ params }: Props) {
  const { id, locale } = await params;

  setRequestLocale(locale);

  if (id.trim() === '') notFound();

  const snapshot = await client.getPageSnapshot(`/new-page-${id}`, {
    siteVersion: await getSiteVersion(),
    locale,
    allowLocaleFallback: true,
  });

  return snapshot ? <MakeswiftPage snapshot={snapshot} /> : <MakeswiftNewPage />;
}
