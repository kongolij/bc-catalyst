import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { setRequestLocale } from 'next-intl/server';

import { client } from '~/lib/makeswift/client';
import { MakeswiftNewPage } from '~/lib/makeswift/components/new-page/client';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NewPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const snapshot = await client.getPageSnapshot('/new-page', {
    siteVersion: await getSiteVersion(),
    locale,
    allowLocaleFallback: true,
  });

  return snapshot ? <MakeswiftPage snapshot={snapshot} /> : <MakeswiftNewPage />;
}
