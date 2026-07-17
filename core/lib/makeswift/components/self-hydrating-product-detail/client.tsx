'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductData {
  id: string;
  name: string;
  path: string;
  description: string;
  plainTextDescription: string;
  image: string | null;
  imageAlt: string;
  price: string;
  salePrice: string;
}

interface Props {
  className?: string;
  previewProductId?: string;
  showPrice?: boolean;
  showDescription?: boolean;
}

function extractProductIdFromPath(pathname: string | null): string | null {
  if (!pathname) return null;

  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1];

  if (!last) return null;

  return /^\d+$/.test(last) ? last : null;
}

export function MakeswiftSelfHydratingProductDetail({
  className,
  previewProductId,
  showPrice = true,
  showDescription = true,
}: Props) {
  const pathname = usePathname();
  const urlProductId = extractProductIdFromPath(pathname);
  const productId = urlProductId ?? previewProductId ?? null;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`/api/bc/product-detail?entityId=${productId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Request failed: ${r.status}`);
        return r.json() as Promise<ProductData>;
      })
      .then((data) => setProduct(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (!productId) {
    return (
      <div className={className}>
        <p className="rounded border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Self-hydrating Product Detail: no product ID found in URL.
          <br />
          Set a preview product in the Makeswift panel to see this component in the editor.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        <div className="animate-pulse space-y-4">
          <div className="h-64 w-full rounded bg-gray-200" />
          <div className="h-6 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={className}>
        <p className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load product {productId}: {error ?? 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-6 @container md:grid-cols-2">
        {product.image ? (
          <div className="overflow-hidden rounded-lg bg-gray-50">
            {}
            <img
              alt={product.imageAlt}
              className="h-full w-full object-cover"
              src={product.image}
            />
          </div>
        ) : (
          <div className="aspect-square rounded-lg bg-gray-100" />
        )}

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>

          {showPrice && (product.price || product.salePrice) ? (
            <div className="flex items-baseline gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">{product.salePrice}</span>
                  <span className="text-lg text-gray-400 line-through">{product.price}</span>
                </>
              ) : (
                <span className="text-2xl font-bold">{product.price}</span>
              )}
            </div>
          ) : null}

          {showDescription && product.description ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
