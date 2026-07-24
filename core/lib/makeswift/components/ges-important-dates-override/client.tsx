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
  showDataDiagnostics?: boolean;
  title?: string;
  countdownLabel?: string;
  countdownBg?: string;
  countdownText?: string;
  maxRows?: number;
  calendarLinkLabel?: string;
  manualRows?: ManualRow[];
  hiddenIds?: HiddenId[];
}

type Provenance = 'api' | 'api-with-override' | 'local';

interface MergedRow extends ApiRow {
  provenance: Provenance;
  overriddenFields: string[];
}

interface DataDiagnostic {
  id: string;
  label?: string;
}

interface MergeResult {
  rows: MergedRow[];
  excluded: DataDiagnostic[];
  orphanedOverrides: DataDiagnostic[];
  orphanedExclusions: DataDiagnostic[];
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

function getOverriddenFields(manual: ManualRow): string[] {
  return [
    manual.startDate?.trim() ? 'startDate' : null,
    manual.endDate?.trim() ? 'endDate' : null,
    manual.scheduleType?.trim() ? 'scheduleType' : null,
    manual.scheduleNotes?.trim() ? 'scheduleNotes' : null,
    manual.isCountdownTarget ? 'isCountdownTarget' : null,
  ].filter((field): field is string => field !== null);
}

export function GesImportantDatesOverrideClient({
  className,
  showDataDiagnostics = false,
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
  const [sourceLoaded, setSourceLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSourceLoaded(false);
    fetch('/api/ges/quick-facts/dates')
      .then((r) => r.json())
      .then((data: { dates: ApiRow[] }) => {
        if (!cancelled) {
          setApiRows(data.dates ?? []);
          setSourceLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiRows([]);
          setSourceLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const mergeResult = useMemo<MergeResult>(() => {
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
    const sourceById = new Map(
      apiRows
        .filter((row): row is ApiRow & { id: string } => Boolean(row.id))
        .map((row) => [row.id, row]),
    );
    const sourceIds = new Set(sourceById.keys());

    const kept: MergedRow[] = apiRows
      .filter((r) => !r.id || !hidden.has(r.id))
      .map((r) => {
        const override = r.id ? overridesById.get(r.id) : undefined;
        return override
          ? {
              ...mergeRow(r, override),
              provenance: 'api-with-override',
              overriddenFields: getOverriddenFields(override),
            }
          : { ...r, provenance: 'api', overriddenFields: [] };
      });

    const local: MergedRow[] = additions.map((row, index) => ({
      ...row,
      id: `local-${index}`,
      provenance: 'local',
      overriddenFields: [],
    }));
    const excluded = Array.from(hidden)
      .filter((id) => sourceIds.has(id))
      .map((id) => ({ id, label: sourceById.get(id)?.scheduleType }));
    const orphanedOverrides = sourceLoaded
      ? Array.from(overridesById.keys())
          .filter((id) => !sourceIds.has(id))
          .map((id) => ({ id }))
      : [];
    const orphanedExclusions = sourceLoaded
      ? Array.from(hidden)
          .filter((id) => !sourceIds.has(id))
          .map((id) => ({ id }))
      : [];

    return {
      rows: [...kept, ...local],
      excluded,
      orphanedOverrides,
      orphanedExclusions,
    };
  }, [apiRows, manualRows, hiddenIds, sourceLoaded]);

  const upcoming = useMemo<MergedRow[]>(() => {
    const now = new Date();
    return mergeResult.rows
      .filter((r) => {
        const d = parseIso(r.startDate);
        return d !== null && d.getTime() >= now.getTime() - 1000 * 60 * 60 * 24;
      })
      .sort((a, b) => parseIso(a.startDate)!.getTime() - parseIso(b.startDate)!.getTime());
  }, [mergeResult.rows]);

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
  const orphanCount =
    mergeResult.orphanedOverrides.length + mergeResult.orphanedExclusions.length;

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
              {showDataDiagnostics ? (
                <div className="ges-data-record__diagnostics">
                  <span data-provenance={r.provenance}>
                    {r.provenance === 'api'
                      ? 'API'
                      : r.provenance === 'api-with-override'
                        ? 'API + override'
                        : 'Local'}
                  </span>
                  {r.overriddenFields.length > 0 ? (
                    <small>Customized: {r.overriddenFields.join(', ')}</small>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="ges-important-dates__empty">No upcoming dates.</p>
      )}

      <a className="ges-important-dates__cal" href="/api/ges/quick-facts/dates">
        {calendarLinkLabel}
      </a>
      {showDataDiagnostics ? (
        <aside className="ges-data-diagnostics">
          <strong>Data diagnostics</strong>
          {!sourceLoaded ? <p>Loading source records…</p> : null}
          {mergeResult.excluded.length > 0 ? (
            <>
              <h4>Excluded API records</h4>
              <ul>
                {mergeResult.excluded.map((item) => (
                  <li key={`excluded-${item.id}`}>
                    {item.label ?? item.id} <span>Excluded</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {orphanCount > 0 ? (
            <>
              <h4>{orphanCount} orphaned customization(s)</h4>
              <ul>
                {mergeResult.orphanedOverrides.map((item) => (
                  <li key={`override-${item.id}`}>
                    Override for {item.id} no longer matches an API record.
                  </li>
                ))}
                {mergeResult.orphanedExclusions.map((item) => (
                  <li key={`exclusion-${item.id}`}>
                    Exclusion for {item.id} no longer matches an API record.
                  </li>
                ))}
              </ul>
              <p>Remove these IDs from the component’s override or hidden lists.</p>
            </>
          ) : null}
          {sourceLoaded && mergeResult.excluded.length === 0 && orphanCount === 0 ? (
            <p>No exclusions or orphaned customizations.</p>
          ) : null}
        </aside>
      ) : null}
    </section>
  );
}
