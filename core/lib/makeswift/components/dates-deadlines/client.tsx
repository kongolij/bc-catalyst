'use client';

import { useEffect, useState } from 'react';

import {
  DateTable,
  type DateRow,
  GesSection,
  ThemedText,
  type TextVariant,
} from '~/lib/ges-theme/primitives';

interface DateOverride {
  startDate?: string;
  endDate?: string;
  scheduleType?: string;
  scheduleNotes?: string;
}

interface Props {
  className?: string;
  title?: string;
  titleVariant?: TextVariant;
  description?: string;
  date1Override?: DateOverride;
  date2Override?: DateOverride;
  date3Override?: DateOverride;
  date4Override?: DateOverride;
}

function isBlank(s?: string) {
  return !s || s.trim().length === 0;
}

function applyOverride(base: DateRow | undefined, override?: DateOverride): DateRow | null {
  const startDate = !isBlank(override?.startDate) ? override!.startDate : base?.startDate;
  const endDate = !isBlank(override?.endDate) ? override!.endDate : base?.endDate;
  const scheduleType = !isBlank(override?.scheduleType) ? override!.scheduleType : base?.scheduleType;
  const scheduleNotes = !isBlank(override?.scheduleNotes) ? override!.scheduleNotes : base?.scheduleNotes;

  if (!startDate && !scheduleType && !scheduleNotes) return null;
  return { startDate, endDate, scheduleType, scheduleNotes };
}

export function DatesDeadlinesClient({
  className,
  title,
  titleVariant = 'h2',
  description,
  date1Override,
  date2Override,
  date3Override,
  date4Override,
}: Props) {
  const [apiDates, setApiDates] = useState<DateRow[]>([]);

  useEffect(() => {
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
  }, []);

  const overrides = [date1Override, date2Override, date3Override, date4Override];
  const merged = overrides
    .map((override, i) => applyOverride(apiDates[i], override))
    .filter((r): r is DateRow => r !== null);

  const extras = apiDates.slice(overrides.length);
  const rows = [...merged, ...extras];

  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      {description && <ThemedText text={description} variant="body" />}
      <DateTable rows={rows} />
    </GesSection>
  );
}
