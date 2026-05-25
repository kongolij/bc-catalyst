'use server';

import { BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { getTranslations } from 'next-intl/server';
import { revalidatePath, unstable_expireTag } from 'next/cache';
import { ReactNode } from 'react';

import { Field, schema } from '@/vibes/soul/sections/product-detail/schema';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { Link } from '~/components/link';
import { bcRestGet, bcRestPost } from '~/lib/bigcommerce-rest';
import { addToOrCreateCart, getCartId, setCartId } from '~/lib/cart';
import { MissingCartError } from '~/lib/cart/error';
import { getActiveShow } from '~/lib/active-show';
import { addToShowCart } from '~/lib/show-cart';

const CustomerEntityIdQuery = graphql(`
  query PDPShowAddToCartCustomerQuery {
    customer {
      entityId
    }
  }
`);

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
      console.log('[pdp-add-to-cart] show mode active — showId:', activeShow.showId, '| priceListId:', activeShow.priceListId);

      const customerAccessToken = await getSessionCustomerAccessToken();

      // Fetch variant list, product info, and customer ID in parallel
      const [variantsRes, productRes, customerRes] = await Promise.all([
        bcRestGet<{ data: BCVariant[] }>(
          `/v3/catalog/products/${productEntityId}/variants?limit=250`,
        ),
        bcRestGet<{ data: BCProduct }>(`/v3/catalog/products/${productEntityId}`),
        customerAccessToken
          ? client.fetch({
              document: CustomerEntityIdQuery,
              customerAccessToken,
              fetchOptions: { cache: 'no-store' },
            })
          : Promise.resolve(null),
      ]);

      const customerId = customerRes?.data?.customer?.entityId;

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

      console.log('[pdp-add-to-cart] variant resolved:', variant?.id, '| customerId:', customerId);

      if (variant) {
        // Fetch show price records and filter client-side — BC API rejects variant_id/currency_code as query params
        const priceRes = await bcRestGet<{
          data: Array<{
            variant_id?: number;
            price?: number;
            sale_price?: number;
            currency?: string;
          }>;
        }>(`/v3/pricelists/${activeShow.priceListId}/records?limit=250`);

        const record = priceRes.data.find(
          (r) =>
            r.variant_id === variant.id &&
            (!r.currency || r.currency.toUpperCase() === 'CAD'),
        );

        const showPrice = record?.price ?? record?.sale_price;

        console.log('[pdp-add-to-cart] showPrice:', showPrice, '| record:', JSON.stringify(record));

        if (showPrice !== undefined) {
          const lineItem = {
            product_id: productEntityId,
            variant_id: variant.id,
            quantity,
            list_price: showPrice,
          };

          const existingCartId = await getCartId();

          console.log('[pdp-add-to-cart] existingCartId:', existingCartId ?? 'none');

          let finalCartId: string;

          if (existingCartId) {
            const res = await bcRestPost<BCCartResponse>(`/v3/carts/${existingCartId}/items`, { line_items: [lineItem] });

            finalCartId = existingCartId;
            console.log('[pdp-add-to-cart] added to existing cart:', existingCartId, '| response id:', res.data?.id);
          } else {
            const channelId = parseInt(process.env.BIGCOMMERCE_CHANNEL_ID ?? '1', 10);
            const createPayload = {
              channel_id: channelId,
              ...(customerId !== undefined ? { customer_id: customerId } : {}),
              line_items: [lineItem],
            };

            console.log('[pdp-add-to-cart] creating cart payload:', JSON.stringify(createPayload));

            const newCart = await bcRestPost<BCCartResponse>('/v3/carts', createPayload);

            finalCartId = newCart.data.id;
            console.log('[pdp-add-to-cart] cart created:', finalCartId);

            await setCartId(finalCartId);
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
          revalidatePath('/cart');

          console.log('[pdp-add-to-cart] show path complete — cartId in session:', finalCartId);

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
    console.log('[pdp-add-to-cart] falling back to standard Storefront flow');
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
