'use client';

import { useEffect, useMemo, useState } from 'react';

import { type DateRow } from '~/lib/ges-theme/primitives';

import { buildIcs, downloadIcs } from './ics';

interface Props {
  className?: string;
  source?: 'api' | 'manual';
  rows?: DateRow[];
  calendarFileName?: string;
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function isNonEmpty(r?: DateRow): r is DateRow {
  return !!(r && (r.startDate || r.scheduleType || r.scheduleNotes));
}

export function GesSelectableDatesClient({
  className,
  source = 'api',
  rows: manualRows,
  calendarFileName = 'ges-dates.ics',
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
    const source_rows = source === 'api' ? apiRows : (manualRows ?? []).filter(isNonEmpty);
    return source_rows;
  }, [source, apiRows, manualRows]);

  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSelected(new Set(rows.map((_, i) => i)));
  }, [rows]);

  const allSelected = rows.length > 0 && selected.size === rows.length;

  const toggleRow = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows.map((_, i) => i)));
  };

  const addToCalendar = () => {
    const events = Array.from(selected)
      .sort((a, b) => a - b)
      .map((i) => {
        const r = rows[i];
        if (!r) return null;
        return {
          uid: `ges-${i}-${r.startDate ?? ''}`,
          startDate: r.startDate ?? '',
          endDate: r.endDate,
          summary: r.scheduleType ?? 'GES Event',
          description: r.scheduleNotes,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null && !!e.startDate);
    if (events.length === 0) return;
    downloadIcs(calendarFileName, buildIcs(events));
  };

  if (rows.length === 0) return null;

  return (
    <div className={['ges-selectable-dates', className].filter(Boolean).join(' ')}>
      <button type="button" className="ges-btn ges-btn--secondary ges-selectable-dates__toggle-all" onClick={toggleAll}>
        {allSelected ? 'Unselect All' : 'Select All'}
      </button>

      <ul className="ges-selectable-dates__list">
        {rows.map((r, i) => (
          <li key={i} className="ges-selectable-dates__row">
            <label className="ges-selectable-dates__label">
              <input
                type="checkbox"
                checked={selected.has(i)}
                onChange={() => toggleRow(i)}
              />
              <span>
                <strong>
                  {formatDate(r.startDate)}
                  {r.endDate && r.endDate !== r.startDate ? ` – ${formatDate(r.endDate)}` : ''}
                </strong>
                {r.scheduleType && <> : {r.scheduleType}</>}
                {r.scheduleNotes && <> — {r.scheduleNotes}</>}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="ges-btn ges-btn--link ges-selectable-dates__add"
        onClick={addToCalendar}
        disabled={selected.size === 0}
      >
        + Add Dates to Calendar
      </button>
    </div>
  );
}
