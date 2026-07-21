'use client';

import { type ReactNode } from 'react';

interface Props {
  className?: string;
  columns?: '2' | '3' | '4' | '5';
  gap?: string;
  children?: ReactNode;
}

export function GesCategoryGridClient({
  className,
  columns = '4',
  gap = '16px',
  children,
}: Props) {
  return (
    <div
      className={['ges-cat-grid', className].filter(Boolean).join(' ')}
      data-cols={columns}
      style={{ ['--ges-cat-gap' as string]: gap }}
    >
      {children}
    </div>
  );
}
