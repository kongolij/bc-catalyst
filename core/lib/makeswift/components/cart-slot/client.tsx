'use client';

import { type ReactNode } from 'react';

interface Props {
  className?: string;
  content?: ReactNode;
}

export function MakeswiftCartSlot({ className, content }: Props) {
  return <div className={className}>{content}</div>;
}
