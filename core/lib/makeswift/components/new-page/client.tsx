'use client';

import { type ReactNode } from 'react';

interface Props {
  top?: ReactNode;
  content?: ReactNode;
  bottom?: ReactNode;
}

export function MakeswiftNewPage({ top, content, bottom }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {top}
      {content}
      {bottom}
    </div>
  );
}
