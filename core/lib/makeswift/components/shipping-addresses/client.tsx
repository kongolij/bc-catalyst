'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface AddressItem {
  id?: string;
  title?: string;
  lines?: string[];
  notes?: string;
}

interface SeededAddress {
  title?: string;
  body?: string;
  notes?: string;
}

interface Props {
  className?: string;
  header?: ReactNode;
  useApiAddresses?: boolean;
  address1?: SeededAddress;
  address2?: SeededAddress;
  extraContent?: ReactNode;
}

function seededToAddress(s?: SeededAddress): AddressItem | null {
  if (!s) return null;
  const lines = (s.body ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (!s.title && lines.length === 0 && !s.notes) return null;
  return { title: s.title, lines, notes: s.notes };
}

function AddressGrid({ addresses }: { addresses: AddressItem[] }) {
  if (addresses.length === 0) return null;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {addresses.map((addr, i) => (
        <div className="rounded border border-gray-200 p-4" key={addr.id ?? i}>
          {addr.title && <h3 className="mb-2 font-semibold">{addr.title}</h3>}
          <ul className="space-y-1 text-sm">
            {(addr.lines ?? []).map((line, li) => (
              <li key={li}>{line}</li>
            ))}
          </ul>
          {addr.notes && <p className="mt-3 text-xs text-gray-600">{addr.notes}</p>}
        </div>
      ))}
    </div>
  );
}

export function ShippingAddressesClient({
  className,
  header,
  useApiAddresses = true,
  address1,
  address2,
  extraContent,
}: Props) {
  const [apiAddresses, setApiAddresses] = useState<AddressItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!useApiAddresses) return;
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
  }, [useApiAddresses]);

  const seeded = [seededToAddress(address1), seededToAddress(address2)].filter(
    (a): a is AddressItem => a !== null,
  );
  const addresses = useApiAddresses ? apiAddresses ?? [] : seeded;

  return (
    <section className={className}>
      <div className="mb-3">{header}</div>
      {loading && useApiAddresses && (
        <p className="text-sm text-gray-500">Loading addresses…</p>
      )}
      <AddressGrid addresses={addresses} />
      <div className="mt-4">{extraContent}</div>
    </section>
  );
}
