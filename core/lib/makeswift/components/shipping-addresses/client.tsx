'use client';

import { useEffect, useState } from 'react';

import {
  AddressGrid,
  type AddressCard,
  GesSection,
  ThemedText,
  type TextVariant,
} from '~/lib/ges-theme/primitives';

interface OverrideAddress {
  title?: string;
  body?: string;
  notes?: string;
}

interface Props {
  className?: string;
  title?: string;
  titleVariant?: TextVariant;
  address1Override?: OverrideAddress;
  address2Override?: OverrideAddress;
}

function isBlank(s?: string) {
  return !s || s.trim().length === 0;
}

function applyOverride(base: AddressCard | undefined, override?: OverrideAddress): AddressCard | null {
  const overrideLines = !isBlank(override?.body)
    ? override!.body!.split('\n').map((l) => l.trim()).filter((l) => l.length > 0)
    : null;

  const title = !isBlank(override?.title) ? override!.title : base?.title;
  const lines = overrideLines ?? base?.lines ?? [];
  const notes = !isBlank(override?.notes) ? override!.notes : base?.notes;

  if (!title && lines.length === 0 && !notes) return null;
  return { title, lines, notes };
}

export function ShippingAddressesClient({
  className,
  title,
  titleVariant = 'h2',
  address1Override,
  address2Override,
}: Props) {
  const [apiAddresses, setApiAddresses] = useState<AddressCard[]>([]);

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

  const overrides = [address1Override, address2Override];
  const merged = overrides
    .map((override, i) => applyOverride(apiAddresses[i], override))
    .filter((a): a is AddressCard => a !== null);

  const extras = apiAddresses.slice(overrides.length);
  const addresses = [...merged, ...extras];

  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      <AddressGrid addresses={addresses} />
    </GesSection>
  );
}
