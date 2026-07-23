'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { GesSection, ThemedText, type TextVariant } from '~/lib/ges-theme/primitives';

interface Props {
  className?: string;
  title?: string;
  titleVariant?: TextVariant;
  useOverrideBody?: boolean;
  beforeSlot?: ReactNode;
  overrideBody?: ReactNode;
  afterSlot?: ReactNode;
}

export function LogisticsBlockOverrideClient({
  className,
  title,
  titleVariant = 'h2',
  useOverrideBody = false,
  beforeSlot,
  overrideBody,
  afterSlot,
}: Props) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    if (useOverrideBody) {
      setHtml('');
      return;
    }
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
  }, [useOverrideBody]);

  return (
    <GesSection className={className}>
      {title ? <ThemedText text={title} variant={titleVariant} /> : null}

      {beforeSlot ? <div className="ges-logistics__before">{beforeSlot}</div> : null}

      {useOverrideBody ? (
        <div className="ges-logistics__body">{overrideBody}</div>
      ) : (
        <div className="ges-logistics__body" dangerouslySetInnerHTML={{ __html: html }} />
      )}

      {afterSlot ? <div className="ges-logistics__after">{afterSlot}</div> : null}
    </GesSection>
  );
}
