'use client';

import { type ReactNode } from 'react';

interface Props {
  className?: string;
  content?: ReactNode;
}

export function LogisticsBlockClient({ className, content }: Props) {
  return <section className={className}>{content}</section>;
}
