import { getSiteVersion } from '@makeswift/runtime/next/server';
import { headers } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { MakeswiftProvider } from '~/components/makeswift/provider';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-bc-pathname') ?? '';
  const hideChrome = /^\/new-page-\d+$/.test(pathname);

  setRequestLocale(locale);

  return (
    <MakeswiftProvider siteVersion={await getSiteVersion()}>
      {!hideChrome && <Header />}

      <main>{children}</main>

      {!hideChrome && <Footer />}
    </MakeswiftProvider>
  );
}
