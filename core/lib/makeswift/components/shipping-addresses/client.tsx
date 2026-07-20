'use client';

import { type ReactNode, useEffect, useState } from 'react';

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
  useApi?: boolean;
  customContent?: ReactNode;
}

export function ShippingAddressesClient({
  className,
  title,
  titleVariant = 'h2',
  useApi = true,
  customContent,
}: Props) {
  const [apiAddresses, setApiAddresses] = useState<AddressCard[]>([]);

  useEffect(() => {
    if (!useApi) return;
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
  }, [useApi]);

  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      {useApi ? <AddressGrid addresses={apiAddresses} /> : <div>{customContent}</div>}
    </GesSection>
  );
}
