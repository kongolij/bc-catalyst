import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { ShowLookup } from './_components/show-lookup';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Find Show',
};

export default async function ShowsPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <ShowLookup />;
}
