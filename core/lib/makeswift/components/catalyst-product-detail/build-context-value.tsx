import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { getFormatter, getTranslations } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { ProductDetail } from '@/vibes/soul/sections/product-detail';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { productOptionsTransformer } from '~/data-transformers/product-options-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { addToCart } from '~/app/[locale]/(default)/product/[slug]/_actions/add-to-cart';
import { ProductAnalyticsProvider } from '~/app/[locale]/(default)/product/[slug]/_components/product-analytics-provider';
import { WishlistButton } from '~/app/[locale]/(default)/product/[slug]/_components/wishlist-button';
import {
  getProduct,
  getProductPricingAndRelatedProducts,
  getStreamableProduct,
} from '~/app/[locale]/(default)/product/[slug]/page-data';

import type { CatalystProductContextValue } from './context';

interface BuildOptions {
  productId: number;
  customerAccessToken: string | undefined;
  searchParams: Promise<SearchParams>;
  detachedWishlistFormId?: string;
}

export async function buildCatalystProductContextValue({
  productId,
  customerAccessToken,
  searchParams,
  detachedWishlistFormId = 'product-add-to-wishlist-form',
}: BuildOptions): Promise<CatalystProductContextValue | null> {
  const baseProduct = await getProduct(productId, customerAccessToken);

  if (!baseProduct) return null;

  const t = await getTranslations('Product');
  const format = await getFormatter();

  const streamableProduct = Streamable.from(async () => {
    const options = await searchParams;

    const optionValueIds = Object.keys(options)
      .map((option) => ({
        optionEntityId: Number(option),
        valueEntityId: Number(options[option]),
      }))
      .filter(
        (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
      );

    const product = await getStreamableProduct(
      {
        entityId: Number(productId),
        optionValueIds,
        useDefaultOptionSelections: true,
      },
      customerAccessToken,
    );

    if (!product) {
      throw new Error(`Streamable product ${productId} not found`);
    }

    return product;
  });

  const streamableProductSku = Streamable.from(async () => (await streamableProduct).sku);

  const streamableProductPricingAndRelatedProducts = Streamable.from(async () => {
    const options = await searchParams;

    const optionValueIds = Object.keys(options)
      .map((option) => ({
        optionEntityId: Number(option),
        valueEntityId: Number(options[option]),
      }))
      .filter(
        (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
      );

    const currencyCode = (await getPreferredCurrencyCode()) ?? 'CAD';

    return await getProductPricingAndRelatedProducts(
      {
        entityId: Number(productId),
        optionValueIds,
        useDefaultOptionSelections: true,
        currencyCode,
      },
      customerAccessToken,
    );
  });

  const streamablePrices = Streamable.from(async () => {
    const product = await streamableProductPricingAndRelatedProducts;

    if (!product) return null;

    return pricesTransformer(product.prices, format) ?? null;
  });

  const streamableImages = Streamable.from(async () => {
    const product = await streamableProduct;

    const images = removeEdgesAndNodes(product.images)
      .filter((image) => image.url !== product.defaultImage?.url)
      .map((image) => ({
        src: image.url,
        alt: image.altText,
      }));

    return product.defaultImage
      ? [{ src: product.defaultImage.url, alt: product.defaultImage.altText }, ...images]
      : images;
  });

  const streameableCtaLabel = Streamable.from(async () => {
    const product = await streamableProduct;

    if (product.availabilityV2.status === 'Unavailable') {
      return t('ProductDetails.Submit.unavailable');
    }

    if (product.availabilityV2.status === 'Preorder') {
      return t('ProductDetails.Submit.preorder');
    }

    if (!product.inventory.isInStock) {
      return t('ProductDetails.Submit.outOfStock');
    }

    return t('ProductDetails.Submit.addToCart');
  });

  const streameableCtaDisabled = Streamable.from(async () => {
    const product = await streamableProduct;

    if (product.availabilityV2.status === 'Unavailable') return true;
    if (product.availabilityV2.status === 'Preorder') return false;
    if (!product.inventory.isInStock) return true;

    return false;
  });

  const streameableAccordions = Streamable.from(async () => {
    const product = await streamableProduct;

    const customFields = removeEdgesAndNodes(product.customFields);

    const specifications = [
      { name: t('ProductDetails.Accordions.sku'), value: product.sku },
      {
        name: t('ProductDetails.Accordions.weight'),
        value: `${product.weight?.value} ${product.weight?.unit}`,
      },
      { name: t('ProductDetails.Accordions.condition'), value: product.condition },
      ...customFields.map((field) => ({ name: field.name, value: field.value })),
    ];

    return [
      ...(specifications.length
        ? [
            {
              title: t('ProductDetails.Accordions.specifications'),
              content: (
                <div className="prose @container">
                  <dl className="flex flex-col gap-4">
                    {specifications.map((field, index) => (
                      <div className="grid grid-cols-1 gap-2 @lg:grid-cols-2" key={index}>
                        <dt>
                          <strong>{field.name}</strong>
                        </dt>
                        <dd>{field.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ),
            },
          ]
        : []),
      ...(product.warranty
        ? [
            {
              title: t('ProductDetails.Accordions.warranty'),
              content: (
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: product.warranty }}
                />
              ),
            },
          ]
        : []),
    ];
  });

  const streamableAnalyticsData = Streamable.from(async () => {
    const [extendedProduct, pricingProduct] = await Streamable.all([
      streamableProduct,
      streamableProductPricingAndRelatedProducts,
    ]);

    return {
      id: extendedProduct.entityId,
      name: extendedProduct.name,
      sku: extendedProduct.sku,
      brand: extendedProduct.brand?.name ?? '',
      price: pricingProduct?.prices?.price.value ?? 0,
      currency: pricingProduct?.prices?.price.currencyCode ?? '',
    };
  });

  const productDetail = (
    <ProductAnalyticsProvider data={streamableAnalyticsData}>
      <ProductDetail
        action={addToCart}
        additionalActions={
          <WishlistButton
            formId={detachedWishlistFormId}
            productId={productId}
            productSku={streamableProductSku}
          />
        }
        additionalInformationTitle={t('ProductDetails.additionalInformation')}
        ctaDisabled={streameableCtaDisabled}
        ctaLabel={streameableCtaLabel}
        decrementLabel={t('ProductDetails.decreaseQuantity')}
        emptySelectPlaceholder={t('ProductDetails.emptySelectPlaceholder')}
        fields={productOptionsTransformer(baseProduct.productOptions)}
        incrementLabel={t('ProductDetails.increaseQuantity')}
        prefetch={false}
        product={{
          id: baseProduct.entityId.toString(),
          title: baseProduct.name,
          description: <div dangerouslySetInnerHTML={{ __html: baseProduct.description }} />,
          href: baseProduct.path,
          images: streamableImages,
          price: streamablePrices,
          subtitle: baseProduct.brand?.name,
          rating: baseProduct.reviewSummary.averageRating,
          accordions: streameableAccordions,
        }}
        quantityLabel={t('ProductDetails.quantity')}
        thumbnailLabel={t('ProductDetails.thumbnail')}
      />
    </ProductAnalyticsProvider>
  );

  return {
    entityId: String(productId),
    productDetail,
  };
}
