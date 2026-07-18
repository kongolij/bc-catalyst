import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function PdpPreviewLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <main>{children}</main>;
}
