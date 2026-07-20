'use client';

import { type ReactNode, useEffect, useState } from 'react';

import {
  DateTable,
  type DateRow,
  GesSection,
  ThemedText,
  type TextVariant,
} from '~/lib/ges-theme/primitives';

interface Props {
  className?: string;
  title?: string;
  titleVariant?: TextVariant;
  description?: string;
  mode?: 'api' | 'canvas';
  content?: ReactNode;
}

export function DatesDeadlinesClient({
  className,
  title,
  titleVariant = 'h2',
  description,
  mode = 'api',
  content,
}: Props) {
  const [apiDates, setApiDates] = useState<DateRow[]>([]);

  useEffect(() => {
    if (mode !== 'api') return;
    let cancelled = false;
    fetch('/api/ges/quick-facts/dates')
      .then((r) => r.json())
      .then((data: { dates: DateRow[] }) => {
        if (!cancelled) setApiDates(data.dates ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiDates([]);
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      {description && <ThemedText text={description} variant="body" />}
      {mode === 'canvas' ? <div>{content}</div> : <DateTable rows={apiDates} />}
    </GesSection>
  );
}
