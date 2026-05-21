'use client';

import { useTransition } from 'react';

import type { ShowCartItem } from '~/lib/show-cart';

import { removeShowCartItem } from '../_actions/remove-from-show-cart';

interface Props {
  items: ShowCartItem[];
}

const formatCAD = (value: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);

function ShowCartRow({ item }: { item: ShowCartItem }) {
  const [pending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await removeShowCartItem(item.id);
    });
  };

  return (
    <tr className={`border-b border-gray-100 ${pending ? 'opacity-40' : ''}`}>
      <td className="py-2 pr-4 text-sm text-gray-900">{item.name}</td>
      <td className="py-2 pr-4 text-xs text-gray-500">{item.sku}</td>
      <td className="py-2 pr-4 text-xs text-gray-500">{item.showId}</td>
      <td className="py-2 pr-4 text-sm font-medium text-gray-900 tabular-nums">
        {formatCAD(item.showPrice)}
      </td>
      <td className="py-2 pr-4 text-sm text-gray-700">{item.quantity}</td>
      <td className="py-2 text-sm font-semibold text-gray-900 tabular-nums">
        {formatCAD(item.showPrice * item.quantity)}
      </td>
      <td className="py-2 pl-4">
        <button
          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
          disabled={pending}
          onClick={handleRemove}
          type="button"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export function ShowCart({ items }: Props) {
  if (items.length === 0) return null;

  const total = items.reduce((sum, i) => sum + i.showPrice * i.quantity, 0);

  return (
    <div className="mt-10">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Show Cart</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Show</th>
              <th className="px-3 py-2">Unit price</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Line total</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="px-3">
            {items.map((item) => (
              <ShowCartRow key={item.id} item={item} />
            ))}
          </tbody>
          <tfoot className="border-t border-gray-200 bg-gray-50">
            <tr>
              <td className="px-3 py-2 text-sm font-semibold" colSpan={5}>
                Total
              </td>
              <td className="px-3 py-2 text-sm font-bold tabular-nums">{formatCAD(total)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
