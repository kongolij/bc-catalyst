'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { GesSection, ThemedText, type TextVariant } from '~/lib/ges-theme/primitives';

interface Props {
  className?: string;
  title?: string;
  titleVariant?: TextVariant;
  mode?: 'api' | 'canvas';
  content?: ReactNode;
}

export function LogisticsBlockClient({
  className,
  title,
  titleVariant = 'h2',
  mode = 'api',
  content,
}: Props) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    if (mode !== 'api') return;
    let cancelled = false;
    fetch('/api/ges/quick-facts/logistics')
      .then((r) => r.json())
      .then((data: { html: string }) => {
        if (!cancelled) setHtml(data.html ?? '');
      })
      .catch(() => {
        if (!cancelled) setHtml('');
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  return (
    <GesSection className={className}>
      {title && <ThemedText text={title} variant={titleVariant} />}
      {mode === 'canvas' ? (
        <div className="ges-logistics__body">{content}</div>
      ) : (
        <div className="ges-logistics__body" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </GesSection>
  );
}
