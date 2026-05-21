'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { findShow, FindShowState } from '../_actions/find-show';
import { ShowProductCard } from './show-product-card';

function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Searching…' : 'Find Show'}
    </button>
  );
}

const initialState: FindShowState = { status: 'idle' };

export function ShowLookup() {
  const [state, formAction] = useActionState(findShow, initialState);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Find Show</h1>

      <form action={formAction} className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="showId">
            Show ID
          </label>
          <input
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            id="showId"
            name="showId"
            placeholder="Enter show ID"
            required
            type="text"
          />
        </div>
        <SearchButton />
      </form>

      {state.status !== 'idle' && (
        <div
          className={`mt-4 rounded p-3 text-sm ${
            state.status === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {state.message}
          {state.groupAssigned === false && state.status === 'success' && (
            <span className="block text-xs text-amber-600 mt-1">
              Note: customer group assignment failed — check your API token permissions.
            </span>
          )}
        </div>
      )}

      {state.products && state.products.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Show Products ({state.products.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {state.products.map((product) => (
              <ShowProductCard key={product.entityId} product={product} showId={state.showId ?? ''} />
            ))}
          </div>
        </div>
      )}

      {state.status === 'success' && state.products?.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">No products found for this show.</p>
      )}
    </div>
  );
}
