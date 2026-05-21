import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { getShowCart } from '~/lib/show-cart';

import { ShowCart } from './_components/show-cart';
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

  const showCartItems = await getShowCart();

  return (
    <>
      <ShowCart items={showCartItems} />
      <ShowLookup />
    </>
  );
}
