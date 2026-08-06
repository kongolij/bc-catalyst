import { getSiteVersion } from '@makeswift/runtime/next/server';
import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { MakeswiftProvider } from '~/components/makeswift/provider';
import {
  GlobalGesFooter,
  GlobalGesHeader,
} from '~/lib/makeswift/components/ges-global-chrome';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <MakeswiftProvider siteVersion={await getSiteVersion()}>
      <GlobalGesHeader />
      <main>{children}</main>
      <GlobalGesFooter />
    </MakeswiftProvider>
  );
}
