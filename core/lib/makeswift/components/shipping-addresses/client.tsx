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
  mode?: 'api' | 'canvas';
  content?: ReactNode;
}

export function ShippingAddressesClient({
  className,
  title,
  titleVariant = 'h2',
  mode = 'api',
  content,
}: Props) {
  const [apiAddresses, setApiAddresses] = useState<AddressCard[]>([]);

  useEffect(() => {
    if (mode !== 'api') return;
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
  }, [mode]);

  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      {mode === 'canvas' ? <div>{content}</div> : <AddressGrid addresses={apiAddresses} />}
    </GesSection>
  );
}
