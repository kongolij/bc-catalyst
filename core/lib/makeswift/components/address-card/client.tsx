'use client';

interface Props {
  className?: string;
  title?: string;
  body?: string;
  notes?: string;
}

export function AddressCardClient({ className, title, body, notes }: Props) {
  const lines = (body ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div className={['ges-address', className].filter(Boolean).join(' ')}>
      {title && <div className="ges-address-title">{title}</div>}
      {lines.length > 0 && (
        <ul className="ges-address-lines">
          {lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
      {notes && <p className="ges-address-notes">{notes}</p>}
    </div>
  );
}
