'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Image } from '~/components/image';

import { addShowProductToCart, AddToCartState } from '../_actions/add-to-cart';
import type { ShowProduct } from '../_actions/find-show';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="mt-3 w-full rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Adding…' : 'Add to Cart'}
    </button>
  );
}

interface Props {
  product: ShowProduct;
}

const initialState: AddToCartState = { status: 'idle' };

export function ShowProductCard({ product }: Props) {
  const [state, formAction] = useActionState(addShowProductToCart, initialState);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
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
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-xs text-gray-500">SKU: {product.sku}</p>

        {product.showPrice !== undefined && (
          <p className="mt-2 text-base font-bold text-gray-900">
            {product.currency ? `${product.currency.toUpperCase()} ` : ''}
            {product.showPrice.toFixed(2)}
          </p>
        )}

        {product.description && (
          <div
            className="mt-2 line-clamp-3 text-xs text-gray-600"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {/* Add to cart form */}
        <form action={formAction} className="mt-auto">
          <input name="productId" type="hidden" value={product.entityId} />
          {product.variantEntityId && (
            <input name="variantId" type="hidden" value={product.variantEntityId} />
          )}
          <SubmitButton />
        </form>

        {state.status !== 'idle' && (
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
