'use client';

import { useEffect, useMemo, useState } from 'react';

interface DateRow {
  id?: string;
  startDate?: string;
  endDate?: string;
  scheduleType?: string;
  scheduleNotes?: string;
  isCountdownTarget?: boolean;
}

interface Props {
  className?: string;
  source?: 'api' | 'manual';
  title?: string;
  countdownLabel?: string;
  countdownBg?: string;
  countdownText?: string;
  maxRows?: number;
  calendarLinkLabel?: string;
  manualRows?: DateRow[];
}

function parseIso(value?: string): Date | null {
  if (!value) return null;
  const hasTime = /T\d{2}:\d{2}/.test(value);
  const d = new Date(hasTime ? value : value + 'T00:00:00');
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(from: Date, to: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / oneDay);
}

function formatRow(r: DateRow): string {
  const start = parseIso(r.startDate);
  if (!start) return '';
  const hasTime = /T\d{2}:\d{2}/.test(r.startDate ?? '');
  const datePart = start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const timePart = hasTime
    ? start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';
  const end = parseIso(r.endDate);
  const endTimePart =
    end && /T\d{2}:\d{2}/.test(r.endDate ?? '')
      ? end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : '';
  const timeRange = timePart && endTimePart ? `${timePart} - ${endTimePart}` : timePart;
  const parts = [datePart];
  if (timeRange) parts.push(timeRange);
  if (r.scheduleType) parts.push(r.scheduleType);
  return parts.join(', ');
}

export function GesImportantDatesClient({
  className,
  source = 'api',
  title = 'Important Dates',
  countdownLabel = 'Days Until {label}',
  countdownBg = '#c8d629',
  countdownText = '#0a2540',
  maxRows = 3,
  calendarLinkLabel = '+ Add Dates to Calendar',
  manualRows,
}: Props) {
  const [apiRows, setApiRows] = useState<DateRow[]>([]);

  useEffect(() => {
    if (source !== 'api') return;
    let cancelled = false;
    fetch('/api/ges/quick-facts/dates')
      .then((r) => r.json())
      .then((data: { dates: DateRow[] }) => {
        if (!cancelled) setApiRows(data.dates ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  const rows = useMemo<DateRow[]>(() => {
    if (source === 'manual') return (manualRows ?? []).filter((r) => !!r.startDate);
    return apiRows;
  }, [source, apiRows, manualRows]);

  const upcoming = useMemo<DateRow[]>(() => {
    const now = new Date();
    return rows
      .filter((r) => {
        const d = parseIso(r.startDate);
        return d !== null && d.getTime() >= now.getTime() - 1000 * 60 * 60 * 24;
      })
      .sort((a, b) => parseIso(a.startDate)!.getTime() - parseIso(b.startDate)!.getTime());
  }, [rows]);

  const countdownTarget = useMemo<DateRow | undefined>(() => {
    const flagged = upcoming.find((r) => r.isCountdownTarget);
    return flagged ?? upcoming[0];
  }, [upcoming]);

  const shown = upcoming.slice(0, Math.max(1, maxRows));

  const countdown = useMemo(() => {
    if (!countdownTarget?.startDate) return null;
    const target = parseIso(countdownTarget.startDate);
    if (!target) return null;
    const days = daysBetween(new Date(), target);
    return { days: Math.max(0, days), label: countdownTarget.scheduleType ?? '' };
  }, [countdownTarget]);

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

      {source === 'api' ? (
        <a className="ges-important-dates__cal" href="/api/ges/quick-facts/dates">
          {calendarLinkLabel}
        </a>
      ) : null}
    </section>
  );
}
