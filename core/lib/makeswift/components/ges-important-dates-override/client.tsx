'use client';

import { useEffect, useMemo, useState } from 'react';

interface ApiRow {
  id?: string;
  startDate?: string;
  endDate?: string;
  scheduleType?: string;
  scheduleNotes?: string;
  isCountdownTarget?: boolean;
}

type ComboValue = string | { value?: string; id?: string } | undefined;

interface ManualRow {
  matchId?: ComboValue;
  startDate?: string;
  endDate?: string;
  scheduleType?: string;
  scheduleNotes?: string;
  isCountdownTarget?: boolean;
}

interface HiddenId {
  id?: ComboValue;
}

function comboToString(v: ComboValue): string {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    const raw = v.value ?? v.id ?? '';
    return typeof raw === 'string' ? raw.trim() : '';
  }
  return '';
}

interface Props {
  className?: string;
  title?: string;
  countdownLabel?: string;
  countdownBg?: string;
  countdownText?: string;
  maxRows?: number;
  calendarLinkLabel?: string;
  manualRows?: ManualRow[];
  hiddenIds?: HiddenId[];
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

function formatRow(r: ApiRow): string {
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

// Manual field wins when non-empty; otherwise fall back to API value.
function mergeRow(apiRow: ApiRow, manual: ManualRow): ApiRow {
  const pick = <T,>(m: T | undefined, a: T | undefined): T | undefined => {
    if (typeof m === 'string') return m.trim() ? m : a;
    if (typeof m === 'boolean') return m ? m : a;
    return m ?? a;
  };
  return {
    id: apiRow.id,
    startDate: pick(manual.startDate, apiRow.startDate),
    endDate: pick(manual.endDate, apiRow.endDate),
    scheduleType: pick(manual.scheduleType, apiRow.scheduleType),
    scheduleNotes: pick(manual.scheduleNotes, apiRow.scheduleNotes),
    isCountdownTarget: manual.isCountdownTarget || apiRow.isCountdownTarget,
  };
}

export function GesImportantDatesOverrideClient({
  className,
  title = 'Important Dates',
  countdownLabel = 'Days Until {label}',
  countdownBg = '#c8d629',
  countdownText = '#0a2540',
  maxRows = 10,
  calendarLinkLabel = '+ Add Dates to Calendar',
  manualRows,
  hiddenIds,
}: Props) {
  const [apiRows, setApiRows] = useState<ApiRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ges/quick-facts/dates')
      .then((r) => r.json())
      .then((data: { dates: ApiRow[] }) => {
        if (!cancelled) setApiRows(data.dates ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const merged = useMemo<ApiRow[]>(() => {
    const hidden = new Set(
      (hiddenIds ?? []).map((h) => comboToString(h.id)).filter(Boolean),
    );
    const overridesById = new Map<string, ManualRow>();
    const additions: ManualRow[] = [];

    (manualRows ?? []).forEach((m) => {
      const key = comboToString(m.matchId);
      if (key) {
        overridesById.set(key, m);
      } else if (m.startDate?.trim() || m.scheduleType?.trim()) {
        additions.push(m);
      }
    });

    const kept = apiRows
      .filter((r) => !r.id || !hidden.has(r.id))
      .map((r) => {
        const override = r.id ? overridesById.get(r.id) : undefined;
        return override ? mergeRow(r, override) : r;
      });

    // eslint-disable-next-line no-console
    console.debug('[ImportantDatesOverride] merge', {
      apiRows,
      manualRows,
      hiddenIds,
      overrides: Array.from(overridesById.keys()),
      additionsCount: additions.length,
      merged: [...kept, ...additions],
    });

    return [...kept, ...additions];
  }, [apiRows, manualRows, hiddenIds]);

  const upcoming = useMemo<ApiRow[]>(() => {
    const now = new Date();
    return merged
      .filter((r) => {
        const d = parseIso(r.startDate);
        return d !== null && d.getTime() >= now.getTime() - 1000 * 60 * 60 * 24;
      })
      .sort((a, b) => parseIso(a.startDate)!.getTime() - parseIso(b.startDate)!.getTime());
  }, [merged]);

  const countdownTarget = useMemo<ApiRow | undefined>(() => {
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

      {shown.length > 0 ? (
        <ul className="ges-important-dates__list">
          {shown.map((r, i) => (
            <li key={r.id ?? i} className="ges-important-dates__row">
              {formatRow(r)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="ges-important-dates__empty">No upcoming dates.</p>
      )}

      <a className="ges-important-dates__cal" href="/api/ges/quick-facts/dates">
        {calendarLinkLabel}
      </a>
    </section>
  );
}
