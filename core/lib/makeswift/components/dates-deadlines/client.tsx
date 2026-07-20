'use client';

import { useEffect, useState } from 'react';

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
  useApiDates?: boolean;
  date1?: DateRow;
  date2?: DateRow;
  date3?: DateRow;
  date4?: DateRow;
}

function isNonEmpty(d?: DateRow) {
  return !!(d && (d.startDate || d.scheduleType || d.scheduleNotes));
}

export function DatesDeadlinesClient({
  className,
  title,
  titleVariant = 'h2',
  description,
  useApiDates = true,
  date1,
  date2,
  date3,
  date4,
}: Props) {
  const [apiDates, setApiDates] = useState<DateRow[] | null>(null);

  useEffect(() => {
    if (!useApiDates) return;
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
  }, [useApiDates]);

  const seededDates = [date1, date2, date3, date4].filter(isNonEmpty) as DateRow[];
  const rows = useApiDates ? apiDates ?? [] : seededDates;

  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      {description && <ThemedText text={description} variant="body" />}
      <DateTable rows={rows} />
    </GesSection>
  );
}
