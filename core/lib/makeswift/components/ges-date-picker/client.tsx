'use client';

import { useIsInBuilder } from '@makeswift/runtime/react';
import { Calendar } from 'lucide-react';

interface Props {
  className?: string;
  picked?: string | { value?: string };
  manualValue?: string;
  label?: string;
  display?: {
    format?: 'long' | 'medium' | 'short' | 'iso';
    showCalendar?: boolean;
    showIcon?: boolean;
  };
  appearance?: {
    background?: string;
    border?: string;
    text?: string;
    accent?: string;
  };
}

function resolveValue(picked: Props['picked'], manual?: string) {
  if (manual?.trim()) return manual.trim();
  if (typeof picked === 'string') return picked;
  if (picked && typeof picked === 'object') return picked.value ?? '';
  return '';
}

const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function parseDate(value: string | undefined) {
  if (!value?.trim()) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(date: Date, format: NonNullable<Props['display']>['format']) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const pad = (n: number) => String(n).padStart(2, '0');

  switch (format) {
    case 'iso':
      return `${year}-${pad(month + 1)}-${pad(day)}`;
    case 'short':
      return `${pad(month + 1)}/${pad(day)}/${year}`;
    case 'medium':
      return `${MONTHS_SHORT[month]} ${day}, ${year}`;
    case 'long':
    default:
      return `${MONTHS_LONG[month]} ${day}, ${year}`;
  }
}

function MiniCalendar({ date, accent, text }: { date: Date; accent: string; text: string }) {
  const monthLabel = MONTHS_SHORT[date.getMonth()].toUpperCase();
  const day = date.getDate();

  return (
    <div
      aria-hidden
      style={{
        width: 64,
        borderRadius: 8,
        overflow: 'hidden',
        border: `1px solid ${accent}`,
        background: '#fff',
        flexShrink: 0,
        boxShadow: '0 1px 2px rgba(10,37,54,0.08)',
      }}
    >
      <div style={{ background: accent, color: '#fff', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 0' }}>
        {monthLabel}
      </div>
      <div style={{ textAlign: 'center', color: text, fontSize: 24, fontWeight: 700, padding: '6px 0 8px' }}>
        {day}
      </div>
    </div>
  );
}

export function GesDatePickerClient({
  className,
  picked,
  manualValue,
  label,
  display = {},
  appearance = {},
}: Props) {
  const value = resolveValue(picked, manualValue);
  const isInBuilder = useIsInBuilder();

  const format = display.format ?? 'long';
  const showCalendar = display.showCalendar ?? true;
  const showIcon = display.showIcon ?? false;

  const background = appearance.background || '#ffffff';
  const border = appearance.border || '#dce2e6';
  const text = appearance.text || '#0a2536';
  const accent = appearance.accent || '#0e3d5b';

  const parsed = parseDate(value);
  const displayDate = parsed ? formatDate(parsed, format) : '';

  if (!parsed && !isInBuilder) return null;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        borderRadius: 10,
        border: `1px solid ${border}`,
        background,
        color: text,
        fontFamily: 'var(--ges-font-body, Arial, sans-serif)',
      }}
    >
      {showCalendar && parsed && <MiniCalendar accent={accent} date={parsed} text={text} />}
      {showIcon && !showCalendar && <Calendar aria-hidden color={accent} size={22} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {label?.trim() && (
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent }}>
            {label}
          </span>
        )}
        {displayDate ? (
          <strong style={{ fontSize: 16, fontWeight: 600 }}>{displayDate}</strong>
        ) : (
          isInBuilder && (
            <em style={{ fontSize: 13, opacity: 0.6 }}>Enter a date (YYYY-MM-DD) in the sidebar to preview it here.</em>
          )
        )}
      </div>
    </div>
  );
}
