'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface AddressItem {
  id?: string;
  title?: string;
  lines?: string[];
  notes?: string;
}

interface Props {
  className?: string;
  header?: ReactNode;
  useApiAddresses?: boolean;
  manualAddresses?: AddressItem[];
}

export function ShippingAddressesClient({
  className,
  header,
  useApiAddresses = true,
  manualAddresses = [],
}: Props) {
  const [apiAddresses, setApiAddresses] = useState<AddressItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/ges/quick-facts/shipping')
      .then((r) => r.json())
      .then((data: { addresses: AddressItem[] }) => {
        if (!cancelled) setApiAddresses(data.addresses ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiAddresses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasManual = manualAddresses && manualAddresses.length > 0;
  const addresses = useApiAddresses
    ? apiAddresses ?? []
    : hasManual
      ? manualAddresses
      : apiAddresses ?? [];

  return (
    <section className={className}>
      <div className="mb-3">{header}</div>
      {loading && useApiAddresses && (
        <p className="text-sm text-gray-500">Loading addresses…</p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((addr, i) => (
          <div className="rounded border border-gray-200 p-4" key={addr.id ?? i}>
            {addr.title && <h3 className="mb-2 font-semibold">{addr.title}</h3>}
            <ul className="space-y-1 text-sm">
              {(addr.lines ?? []).map((line, li) => (
                <li key={li}>{line}</li>
              ))}
            </ul>
            {addr.notes && (
              <p className="mt-3 text-xs text-gray-600">{addr.notes}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
