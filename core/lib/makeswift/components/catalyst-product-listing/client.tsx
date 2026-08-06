'use client';

import { useIsInBuilder } from '@makeswift/runtime/react';
import { useContext } from 'react';

import { CatalystProductListingContext } from './context';

interface Props {
  className?: string;
}

export function MakeswiftCatalystProductListing({ className }: Props) {
  const context = useContext(CatalystProductListingContext);
  const isInBuilder = useIsInBuilder();

  if (context?.productListing) {
    return <div className={className}>{context.productListing}</div>;
  }

  if (isInBuilder) {
    return (
      <div className={className}>
        <section
          aria-label="Product listing (editor preview)"
          style={{
            border: '1px dashed #c8d32c',
            background:
              'repeating-linear-gradient(45deg, #fafafa 0 10px, #ffffff 10px 20px)',
            padding: 32,
            borderRadius: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#6b7280',
            }}
          >
            Dynamic product listing
          </div>
          <h2
            style={{
              color: '#0a2536',
              fontSize: 20,
              fontWeight: 700,
              margin: '4px 0 8px',
            }}
          >
            Products render here on the published route
          </h2>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
            Products, filters, sort, pagination and compare are resolved by the search or category
            route at request time. Compose promos, banners and other blocks above or below this
            marker.
          </p>
        </section>
      </div>
    );
  }

  return null;
}
