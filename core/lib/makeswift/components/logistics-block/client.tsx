'use client';

import { type ReactNode } from 'react';

import { GesSection, ThemedText, type TextVariant } from '~/lib/ges-theme/primitives';

interface Props {
  className?: string;
  title?: string;
  titleVariant?: TextVariant;
  content?: ReactNode;
}

export function LogisticsBlockClient({
  className,
  title,
  titleVariant = 'h2',
  content,
}: Props) {
  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      <div>{content}</div>
    </GesSection>
  );
}
