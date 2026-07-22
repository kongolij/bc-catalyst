'use client';

import { useEffect, useMemo, useState } from 'react';

interface DateRow {
  id?: string;
  startDate?: string;
  endDate?: string;
  scheduleType?: string;
  scheduleNotes?: string;
}

interface Props {
  className?: string;
  title?: string;
  countdownLabel?: string;
  countdownBg?: string;
  countdownText?: string;
  maxRows?: number;
  calendarLinkLabel?: string;
}

function daysBetween(from: Date, to: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / oneDay);
}

function formatRow(r: DateRow): string {
  if (!r.startDate) return '';
  const hasTime = /T\d{2}:\d{2}/.test(r.startDate);
  const d = new Date(hasTime ? r.startDate : r.startDate + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return r.startDate;
  const datePart = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const timePart = hasTime
    ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';
  const endTimePart =
    r.endDate && /T\d{2}:\d{2}/.test(r.endDate)
      ? new Date(r.endDate).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : '';
  const timeRange = timePart && endTimePart ? `${timePart} - ${endTimePart}` : timePart;
  const label = r.scheduleType ?? '';
  return [datePart, timeRange, label].filter(Boolean).join(', ').replace(', ,', ',');
}

export function GesImportantDatesClient({
  className,
  title = 'Important Dates',
  countdownLabel = 'Days Until {label}',
  countdownBg = '#c8d629',
  countdownText = '#0a2540',
  maxRows = 3,
  calendarLinkLabel = '+ Add Dates to Calendar',
}: Props) {
  const [rows, setRows] = useState<DateRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ges/quick-facts/dates')
      .then((r) => r.json())
      .then((data: { dates: DateRow[] }) => {
        if (!cancelled) setRows(data.dates ?? []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = useMemo<DateRow[]>(() => {
    const now = new Date();
    return rows
      .filter((r) => {
        if (!r.startDate) return false;
        const d = new Date(r.startDate);
        return !Number.isNaN(d.getTime()) && d.getTime() >= now.getTime() - 1000 * 60 * 60 * 24;
      })
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
  }, [rows]);

  const next = upcoming[0];
  const shown = upcoming.slice(0, Math.max(1, maxRows));

  const countdown = useMemo(() => {
    if (!next?.startDate) return null;
    const d = daysBetween(new Date(), new Date(next.startDate));
    return { days: Math.max(0, d), label: next.scheduleType ?? '' };
  }, [next]);

  if (rows.length === 0) return null;

  const filledLabel = countdownLabel.replace('{label}', countdown?.label ?? '');

  return (
    <section className={['ges-important-dates', className].filter(Boolean).join(' ')}>
      {title ? <h2 className="ges-important-dates__title">{title}</h2> : null}

      {countdown ? (
        <div
          className="ges-important-dates__countdown"
          style={{ background: countdownBg, color: countdownText }}
        >
          <div className="ges-important-dates__days">{countdown.days}</div>
          <div className="ges-important-dates__days-label">{filledLabel}</div>
        </div>
      ) : null}

      <ul className="ges-important-dates__list">
        {shown.map((r, i) => (
          <li key={i} className="ges-important-dates__row">
            {formatRow(r)}
          </li>
        ))}
      </ul>

      <a className="ges-important-dates__cal" href="/api/ges/quick-facts/dates">
        {calendarLinkLabel}
      </a>
    </section>
  );
}
