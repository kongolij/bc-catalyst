import { ReactRuntimeProvider } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { runtime } from '~/lib/makeswift/runtime';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <ReactRuntimeProvider runtime={runtime} siteVersion={await getSiteVersion()}>
      <Header />

      <main>{children}</main>

      <Footer />
    </ReactRuntimeProvider>
  );
}
