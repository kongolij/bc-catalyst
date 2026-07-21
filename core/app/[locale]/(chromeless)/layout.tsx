import { getSiteVersion } from '@makeswift/runtime/next/server';
import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { MakeswiftProvider } from '~/components/makeswift/provider';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function ChromelessLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <MakeswiftProvider siteVersion={await getSiteVersion()}>
      <main>{children}</main>
    </MakeswiftProvider>
  );
}
