'use client';

import { type ReactNode } from 'react';

interface Props {
  className?: string;
  heading?: string;
  body?: ReactNode;
  actions?: ReactNode;
}

export function LogisticsCardClient({ className, heading, body, actions }: Props) {
  return (
    <div className={['ges-logistics__body', className].filter(Boolean).join(' ')}>
      {heading && <h3>{heading}</h3>}
      {body}
      {actions && <div>{actions}</div>}
    </div>
  );
}
