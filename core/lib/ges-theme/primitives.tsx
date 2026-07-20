import { type ReactNode } from 'react';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'eyebrow' | 'body' | 'muted';

const classFor: Record<TextVariant, string> = {
  h1: 'ges-h1',
  h2: 'ges-h2',
  h3: 'ges-h3',
  eyebrow: 'ges-eyebrow',
  body: 'ges-body',
  muted: 'ges-muted',
};

interface ThemedTextProps {
  text: string;
  variant?: TextVariant;
}

export function ThemedText({ text, variant = 'body' }: ThemedTextProps) {
  if (!text) return null;
  const cls = classFor[variant];
  switch (variant) {
    case 'h1':
      return <h1 className={cls}>{text}</h1>;
    case 'h2':
      return <h2 className={cls}>{text}</h2>;
    case 'h3':
      return <h3 className={cls}>{text}</h3>;
    default:
      return <p className={cls}>{text}</p>;
  }
}

interface SectionProps {
  className?: string;
  children: ReactNode;
}

export function GesSection({ className, children }: SectionProps) {
  return <section className={['ges-section', className].filter(Boolean).join(' ')}>{children}</section>;
}

export interface AddressCard {
  title?: string;
  lines?: string[];
  notes?: string;
}

export function AddressGrid({ addresses }: { addresses: AddressCard[] }) {
  if (addresses.length === 0) return null;
  return (
    <div className="ges-address-grid">
      {addresses.map((addr, i) => (
        <div className="ges-address" key={i}>
          {addr.title && <div className="ges-address-title">{addr.title}</div>}
          <ul className="ges-address-lines">
            {(addr.lines ?? []).map((line, li) => (
              <li key={li}>{line}</li>
            ))}
          </ul>
          {addr.notes && <p className="ges-address-notes">{addr.notes}</p>}
        </div>
      ))}
    </div>
  );
}

export interface DateRow {
  startDate?: string;
  endDate?: string;
  scheduleType?: string;
  scheduleNotes?: string;
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function DateTable({ rows }: { rows: DateRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="ges-dates-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>
                {formatDate(r.startDate)}
                {r.endDate && r.endDate !== r.startDate ? ` – ${formatDate(r.endDate)}` : ''}
              </td>
              <td>{r.scheduleType}</td>
              <td>{r.scheduleNotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
