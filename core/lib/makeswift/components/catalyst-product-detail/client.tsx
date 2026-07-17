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

  return (
    <div className={className}>
      <p className="rounded border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        Catalyst Product Detail placeholder.
        <br />
        {previewProductId
          ? `Preview product ID "${previewProductId}" set — open /pdp-template?previewProduct=${previewProductId} to preview.`
          : 'Pick a preview product in the Makeswift panel to see this component in the editor.'}
      </p>
    </div>
  );
}
