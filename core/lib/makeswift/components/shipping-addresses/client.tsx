'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { CopyHelper } from '~/lib/ges-theme/copy-helper';
import {
  AddressGrid,
  type AddressCard,
  GesSection,
  ThemedText,
  type TextVariant,
} from '~/lib/ges-theme/primitives';

interface Props {
  className?: string;
  title?: string;
  titleVariant?: TextVariant;
  useApiAddresses?: boolean;
  manualContent?: ReactNode;
}

function addressesToText(addresses: AddressCard[]): string {
  return addresses
    .map((a) => {
      const parts: string[] = [];
      if (a.title) parts.push(a.title);
      if (a.lines) parts.push(...a.lines);
      if (a.notes) parts.push('', a.notes);
      return parts.join('\n');
    })
    .join('\n\n');
}

export function ShippingAddressesClient({
  className,
  title,
  titleVariant = 'h2',
  useApiAddresses = true,
  manualContent,
}: Props) {
  const [apiAddresses, setApiAddresses] = useState<AddressCard[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ges/quick-facts/shipping')
      .then((r) => r.json())
      .then((data: { addresses: AddressCard[] }) => {
        if (!cancelled) setApiAddresses(data.addresses ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiAddresses([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      {useApiAddresses ? (
        <AddressGrid addresses={apiAddresses ?? []} />
      ) : (
        <>
          <CopyHelper
            label="Copy API defaults to clipboard"
            getText={() => addressesToText(apiAddresses ?? [])}
          />
          <div>{manualContent}</div>
        </>
      )}
    </GesSection>
  );
}
