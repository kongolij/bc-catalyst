export interface IcsEvent {
  uid: string;
  startDate: string;
  endDate?: string;
  summary: string;
  description?: string;
}

function toIcsDate(iso: string): string {
  return iso.replace(/-/g, '');
}

function addDay(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildIcs(events: IcsEvent[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GES//quick-facts//EN',
    'CALSCALE:GREGORIAN',
  ];

  for (const e of events) {
    const end = addDay(e.endDate || e.startDate);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid}@ges`,
      `SUMMARY:${escapeText(e.summary)}`,
      ...(e.description ? [`DESCRIPTION:${escapeText(e.description)}`] : []),
      `DTSTART;VALUE=DATE:${toIcsDate(e.startDate)}`,
      `DTEND;VALUE=DATE:${toIcsDate(end)}`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcs(filename: string, ics: string) {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
