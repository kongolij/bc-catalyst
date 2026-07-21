import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { notFound } from 'next/navigation';

import { client } from '~/lib/makeswift/client';

export default async function HomePocPage() {
  const snapshot = await client.getPageSnapshot('/home-poc', {
    siteVersion: await getSiteVersion(),
  });

  if (!snapshot) notFound();

  return <MakeswiftPage snapshot={snapshot} />;
}
