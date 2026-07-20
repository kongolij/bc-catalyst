'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface DateItem {
  id?: string;
  startDate?: string;
  endDate?: string;
  scheduleType?: string;
  scheduleNotes?: string;
}

interface Props {
  className?: string;
  header?: ReactNode;
  description?: ReactNode;
  useApiDates?: boolean;
  date1?: DateItem;
  date2?: DateItem;
  date3?: DateItem;
  date4?: DateItem;
  extraContent?: ReactNode;
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isNonEmpty(d?: DateItem) {
  return !!(d && (d.startDate || d.scheduleType || d.scheduleNotes));
}

function DateTable({ dates }: { dates: DateItem[] }) {
  if (dates.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((d, i) => (
            <tr className="even:bg-gray-50" key={d.id ?? i}>
              <td className="border border-gray-200 px-4 py-2">
                {formatDate(d.startDate)}
                {d.endDate && d.endDate !== d.startDate ? ` – ${formatDate(d.endDate)}` : ''}
              </td>
              <td className="border border-gray-200 px-4 py-2">{d.scheduleType}</td>
              <td className="border border-gray-200 px-4 py-2">{d.scheduleNotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DatesDeadlinesClient({
  className,
  header,
  description,
  useApiDates = true,
  date1,
  date2,
  date3,
  date4,
  extraContent,
}: Props) {
  const [apiDates, setApiDates] = useState<DateItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!useApiDates) return;
    let cancelled = false;
    setLoading(true);
    fetch('/api/ges/quick-facts/dates')
      .then((r) => r.json())
      .then((data: { dates: DateItem[] }) => {
        if (!cancelled) setApiDates(data.dates ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiDates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [useApiDates]);

  const seededDates = [date1, date2, date3, date4].filter(isNonEmpty) as DateItem[];
  const dates = useApiDates ? apiDates ?? [] : seededDates;

  return (
    <section className={className}>
      <div className="mb-3">{header}</div>
      <div className="mb-4 text-sm text-gray-600">{description}</div>
      {loading && useApiDates && <p className="text-sm text-gray-500">Loading dates…</p>}
      <DateTable dates={dates} />
      <div className="mt-4">{extraContent}</div>
    </section>
  );
}
