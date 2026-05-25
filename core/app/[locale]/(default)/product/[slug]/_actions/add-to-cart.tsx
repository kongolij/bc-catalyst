'use server';

import { BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { getTranslations } from 'next-intl/server';
import { unstable_expireTag } from 'next/cache';
import { ReactNode } from 'react';

import { Field, schema } from '@/vibes/soul/sections/product-detail/schema';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { Link } from '~/components/link';
import { bcRestGet, bcRestPost } from '~/lib/bigcommerce-rest';
import { addToOrCreateCart, getCartId, setCartId } from '~/lib/cart';
import { MissingCartError } from '~/lib/cart/error';
import { getActiveShow } from '~/lib/active-show';
import { addToShowCart } from '~/lib/show-cart';

type CartSelectedOptionsInput = ReturnType<typeof graphql.scalar<'CartSelectedOptionsInput'>>;

interface BCVariant {
  id: number;
  sku: string;
  option_values: Array<{ id: number; option_id: number }>;
}

interface BCProduct {
  name: string;
  default_image?: { url_standard: string };
}

interface BCCartResponse {
  data: { id: string };
}

interface State {
  fields: Field[];
  lastResult: SubmissionResult | null;
  successMessage?: ReactNode;
}

export const addToCart = async (
  prevState: State,
  payload: FormData,
): Promise<{
  fields: Field[];
  lastResult: SubmissionResult | null;
  successMessage?: ReactNode;
}> => {
  const t = await getTranslations('Product.ProductDetails');

  const submission = parseWithZod(payload, { schema: schema(prevState.fields) });

  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), fields: prevState.fields };
  }

  const productEntityId = Number(submission.value.id);
  const quantity = Number(submission.value.quantity);

  const selectedOptions = prevState.fields.reduce<CartSelectedOptionsInput>((accum, field) => {
    const optionValueEntityId = submission.value[field.name];

    let multipleChoicesOptionInput;
    let checkboxOptionInput;
    let numberFieldOptionInput;
    let textFieldOptionInput;
    let multiLineTextFieldOptionInput;
    let dateFieldOptionInput;

    // Skip empty strings since option is empty
    if (!optionValueEntityId) return accum;

    switch (field.type) {
      case 'select':
      case 'radio-group':
      case 'swatch-radio-group':
      case 'card-radio-group':
      case 'button-radio-group':
        multipleChoicesOptionInput = {
          optionEntityId: Number(field.name),
          optionValueEntityId: Number(optionValueEntityId),
        };

        if (accum.multipleChoices) {
          return {
            ...accum,
            multipleChoices: [...accum.multipleChoices, multipleChoicesOptionInput],
          };
        }

        return { ...accum, multipleChoices: [multipleChoicesOptionInput] };

      case 'checkbox':
        checkboxOptionInput = {
          optionEntityId: Number(field.name),
          optionValueEntityId:
            optionValueEntityId === 'true'
              ? // @ts-expect-error Types from custom fields are not yet available, pending fix
                Number(field.checkedValue)
              : // @ts-expect-error Types from custom fields are not yet available, pending fix
                Number(field.uncheckedValue),
        };

        if (accum.checkboxes) {
          return { ...accum, checkboxes: [...accum.checkboxes, checkboxOptionInput] };
        }

        return { ...accum, checkboxes: [checkboxOptionInput] };

      case 'number':
        numberFieldOptionInput = {
          optionEntityId: Number(field.name),
          number: Number(optionValueEntityId),
        };

        if (accum.numberFields) {
          return { ...accum, numberFields: [...accum.numberFields, numberFieldOptionInput] };
        }

        return { ...accum, numberFields: [numberFieldOptionInput] };

      case 'text':
        textFieldOptionInput = {
          optionEntityId: Number(field.name),
          text: String(optionValueEntityId),
        };

        if (accum.textFields) {
          return {
            ...accum,
            textFields: [...accum.textFields, textFieldOptionInput],
          };
        }

        return { ...accum, textFields: [textFieldOptionInput] };

      case 'textarea':
        multiLineTextFieldOptionInput = {
          optionEntityId: Number(field.name),
          text: String(optionValueEntityId),
        };

        if (accum.multiLineTextFields) {
          return {
            ...accum,
            multiLineTextFields: [...accum.multiLineTextFields, multiLineTextFieldOptionInput],
          };
        }

        return { ...accum, multiLineTextFields: [multiLineTextFieldOptionInput] };

      case 'date':
        dateFieldOptionInput = {
          optionEntityId: Number(field.name),
          date: new Date(String(optionValueEntityId)).toISOString(),
        };

        if (accum.dateFields) {
          return {
            ...accum,
            dateFields: [...accum.dateFields, dateFieldOptionInput],
          };
        }

        return { ...accum, dateFields: [dateFieldOptionInput] };

      default:
        return { ...accum };
    }
  }, {});

  try {
    const activeShow = await getActiveShow();

    if (activeShow) {
      // Fetch product info and variants in parallel
      const [variantsRes, productRes] = await Promise.all([
        bcRestGet<{ data: BCVariant[] }>(
          `/v3/catalog/products/${productEntityId}/variants?limit=250`,
        ),
        bcRestGet<{ data: BCProduct }>(`/v3/catalog/products/${productEntityId}`),
      ]);

      // Match the selected option values to the correct variant
      const selectedValueIds = new Set(
        (selectedOptions.multipleChoices ?? []).map((c) => c.optionValueEntityId),
      );

      const variant =
        selectedValueIds.size === 0
          ? variantsRes.data[0]
          : variantsRes.data.find((v) => {
              const vValueIds = v.option_values.map((ov) => ov.id);

              return (
                vValueIds.length === selectedValueIds.size &&
                vValueIds.every((id) => selectedValueIds.has(id))
              );
            });

      if (variant) {
        // Fetch the show price for this specific variant from the price list
        const priceRes = await bcRestGet<{
          data: Array<{ price?: number; sale_price?: number }>;
        }>(
          `/v3/pricelists/${activeShow.priceListId}/records?variant_id=${variant.id}&currency_code=CAD&limit=10`,
        );

        const showPrice = priceRes.data[0]?.price ?? priceRes.data[0]?.sale_price;

        if (showPrice !== undefined) {
          const lineItem = {
            product_id: productEntityId,
            variant_id: variant.id,
            quantity,
            list_price: showPrice,
          };

          const existingCartId = await getCartId();

          if (existingCartId) {
            await bcRestPost(`/v3/carts/${existingCartId}/items`, { line_items: [lineItem] });
          } else {
            // No customer_id — BC treats list_price as is_custom_price: true,
            // locking the show price even when the customer switches groups.
            const channelId = parseInt(process.env.BIGCOMMERCE_CHANNEL_ID ?? '1', 10);
            const newCart = await bcRestPost<BCCartResponse>('/v3/carts', {
              channel_id: channelId,
              line_items: [lineItem],
            });

            await setCartId(newCart.data.id);
          }

          // Mirror to cookie show cart so the shows page reflects this item
          await addToShowCart({
            productId: productEntityId,
            variantId: variant.id,
            showId: activeShow.showId,
            showPrice,
            name: productRes.data.name,
            sku: variant.sku,
            imageUrl: productRes.data.default_image?.url_standard,
            quantity,
          });

          unstable_expireTag(TAGS.cart);

          return {
            lastResult: submission.reply(),
            fields: prevState.fields,
            successMessage: t.rich('successMessage', {
              cartItems: quantity,
              cartLink: (chunks) => (
                <Link className="underline" href="/cart" prefetch="viewport" prefetchKind="full">
                  {chunks}
                </Link>
              ),
            }),
          };
        }
      }
    }

    // Standard Storefront flow — no active show, or variant/price not resolved
    await addToOrCreateCart({
      lineItems: [
        {
          productEntityId,
          selectedOptions,
          quantity,
        },
      ],
    });

    return {
      lastResult: submission.reply(),
      fields: prevState.fields,
      successMessage: t.rich('successMessage', {
        cartItems: quantity,
        cartLink: (chunks) => (
          <Link className="underline" href="/cart" prefetch="viewport" prefetchKind="full">
            {chunks}
          </Link>
        ),
      }),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    if (error instanceof BigCommerceGQLError) {
      return {
        lastResult: submission.reply({
          formErrors: error.errors.map(({ message }) => {
            if (message.includes('Not enough stock:')) {
              return message.replace('Not enough stock: ', '').replace(/\(\w.+\)\s{1}/, '');
            }

            return message;
          }),
        }),
        fields: prevState.fields,
      };
    }

    if (error instanceof MissingCartError) {
      return {
        lastResult: submission.reply({ formErrors: [t('missingCart')] }),
        fields: prevState.fields,
      };
    }

    if (error instanceof Error) {
      return {
        lastResult: submission.reply({ formErrors: [error.message] }),
        fields: prevState.fields,
      };
    }

    return {
      lastResult: submission.reply({ formErrors: [t('unknownError')] }),
      fields: prevState.fields,
    };
  }
};
