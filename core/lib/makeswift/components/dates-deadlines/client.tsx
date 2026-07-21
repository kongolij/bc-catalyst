'use client';

import { type ReactNode } from 'react';

import { GesSection, ThemedText, type TextVariant } from '~/lib/ges-theme/primitives';

import { GesSelectableDatesClient } from '../ges-selectable-dates/client';

interface Props {
  className?: string;
  title?: string;
  titleVariant?: TextVariant;
  description?: string;
  mode?: 'api' | 'canvas';
  content?: ReactNode;
}

export function DatesDeadlinesClient({
  className,
  title,
  titleVariant = 'h2',
  description,
  mode = 'api',
  content,
}: Props) {
  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      {description && <ThemedText text={description} variant="body" />}
      {mode === 'canvas' ? <div>{content}</div> : <GesSelectableDatesClient source="api" />}
    </GesSection>
  );
}
