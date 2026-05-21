'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

import { addShowProductToCart, AddToCartState } from '../_actions/add-to-cart';
import type { ShowProduct } from '../_actions/find-show';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="mt-auto mt-3 w-full rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Adding…' : 'Add to Cart'}
    </button>
  );
}

interface Props {
  product: ShowProduct;
  showId: string;
}

const initialState: AddToCartState = { status: 'idle' };

export function ShowProductCard({ product, showId }: Props) {
  const [state, formAction] = useActionState(addShowProductToCart, initialState);

  const formatCAD = (value: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Link className="relative block aspect-square w-full overflow-hidden bg-gray-50" href={product.path}>
        {product.imageUrl ? (
          <Image
            alt={product.imageAlt ?? product.name}
            className="object-contain"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={product.imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">No image</div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link className="hover:underline" href={product.path}>
          <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-gray-500">SKU: {product.sku}</p>

        {product.isMultiVariant ? (
          product.priceMin !== undefined && product.priceMax !== undefined && (
            <p className="mt-2 text-base font-bold text-gray-900">
              {formatCAD(product.priceMin)}
              {product.priceMin !== product.priceMax && ` – ${formatCAD(product.priceMax)}`}
            </p>
          )
        ) : (
          product.showPrice !== undefined && (
            <p className="mt-2 text-base font-bold text-gray-900">{formatCAD(product.showPrice)}</p>
          )
        )}

        {product.description && (
          <div
            className="mt-2 line-clamp-3 text-xs text-gray-600"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {product.isMultiVariant ? (
          <Link
            className="mt-auto mt-3 block w-full rounded bg-black px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
            href={product.path}
          >
            Select Options
          </Link>
        ) : (
          <form action={formAction}>
            <input name="productId" type="hidden" value={product.entityId} />
            {product.variantEntityId && (
              <input name="variantId" type="hidden" value={product.variantEntityId} />
            )}
            {product.showPrice !== undefined && (
              <input name="showPrice" type="hidden" value={product.showPrice} />
            )}
            <input name="showId" type="hidden" value={showId} />
            <SubmitButton />
          </form>
        )}

        {!product.isMultiVariant && state.status !== 'idle' && (
          <p
            className={`mt-2 text-center text-xs ${
              state.status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </div>
  );
}
