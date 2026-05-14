import { MakeswiftProvider } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <MakeswiftProvider siteVersion={await getSiteVersion()}>
      <Header />

      <main>{children}</main>

      <Footer />
    </MakeswiftProvider>
  );
}
