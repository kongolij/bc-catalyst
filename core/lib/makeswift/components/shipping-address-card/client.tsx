'use client';

import { type ReactNode } from 'react';

interface Props {
  className?: string;
  title?: string;
  addressBody?: string;
  hoursTitle?: string;
  hoursLine?: string;
  notes?: ReactNode;
}

export function ShippingAddressCardClient({
  className,
  title,
  addressBody,
  hoursTitle,
  hoursLine,
  notes,
}: Props) {
  const lines = (addressBody ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div className={['ges-ship-card', className].filter(Boolean).join(' ')}>
      {title && <div className="ges-ship-card__title">{title}</div>}
      {lines.length > 0 && (
        <ul className="ges-ship-card__address">
          {lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
      {(hoursTitle || hoursLine) && (
        <div className="ges-ship-card__hours">
          {hoursTitle && <div className="ges-ship-card__hours-title">{hoursTitle}</div>}
          {hoursLine && <div className="ges-ship-card__hours-line">{hoursLine}</div>}
        </div>
      )}
      {notes && <div className="ges-ship-card__notes">{notes}</div>}
    </div>
  );
}
