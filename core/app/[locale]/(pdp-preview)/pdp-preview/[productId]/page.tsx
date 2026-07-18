import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs/server';

import { getSessionCustomerAccessToken } from '~/auth';
import { buildCatalystProductContextValue } from '~/lib/makeswift/components/catalyst-product-detail/build-context-value';

interface Props {
  params: Promise<{ locale: string; productId: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function PdpPreview({ params, searchParams }: Props) {
  const { productId: productIdRaw } = await params;
  const productId = Number(productIdRaw);

  if (Number.isNaN(productId)) notFound();

  const customerAccessToken = await getSessionCustomerAccessToken();

  const contextValue = await buildCatalystProductContextValue({
    productId,
    customerAccessToken,
    searchParams,
  });

  if (!contextValue) notFound();

  return contextValue.productDetail;
}
