'use client';

import { useContext } from 'react';

import { CatalystProductContext } from './context';

interface Props {
  className?: string;
  previewProductId?: string;
}

export function MakeswiftCatalystProductDetail({ className, previewProductId }: Props) {
  const context = useContext(CatalystProductContext);

  if (context?.productDetail) {
    return <div className={className}>{context.productDetail}</div>;
  }

  if (previewProductId) {
    return (
      <div className={className}>
        <iframe
          className="w-full"
          src={`/pdp-preview/${previewProductId}`}
          style={{ border: 0, width: '100%', minHeight: 800 }}
          title="Catalyst product detail preview"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="rounded border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        Catalyst Product Detail placeholder.
        <br />
        Pick a preview product in the Makeswift panel to see this component in the editor.
      </p>
    </div>
  );
}
