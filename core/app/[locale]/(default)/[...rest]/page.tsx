import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { notFound } from 'next/navigation';

import { client } from '~/lib/makeswift/client';

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
  const { rest } = await params;
  const pathname = '/' + rest.join('/');

  const snapshot = await client.getPageSnapshot(pathname, {
    siteVersion: await getSiteVersion(),
  });

  if (!snapshot) notFound();

  return <MakeswiftPage snapshot={snapshot} />;
}
