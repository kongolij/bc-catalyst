'use client';

import { useIsInBuilder } from '@makeswift/runtime/react';
import { type ReactNode } from 'react';

interface Props {
  className?: string;
  source?: 'api' | 'makeswift';
  apiFallback?: {
    title?: string;
    body?: string;
  };
  content?: ReactNode;
  hideWhenEmpty?: boolean;
  appearance?: {
    background?: string;
    text?: string;
    accent?: string;
    align?: 'left' | 'center';
  };
}

export function GesWelcomeMessageClient({
  className,
  source = 'api',
  apiFallback = {},
  content,
  hideWhenEmpty = true,
  appearance = {},
}: Props) {
  const isInBuilder = useIsInBuilder();
  const background = appearance.background || '#ffffff';
  const text = appearance.text || '#0a2536';
  const accent = appearance.accent || '#0e3d5b';
  const align = appearance.align || 'left';
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  const title = apiFallback.title?.trim() ?? '';
  const body = apiFallback.body?.trim() ?? '';
  const apiHasContent = title.length > 0 || body.length > 0;

  const isMakeswiftMode = source === 'makeswift';

  if (!isMakeswiftMode && !apiHasContent && hideWhenEmpty && !isInBuilder) {
    return null;
  }

  return (
    <section
      className={`${className ?? ''} w-full px-4 py-8`}
      style={{ backgroundColor: background, color: text }}
    >
      <div className={`mx-auto max-w-[900px] ${alignClass}`}>
        {isMakeswiftMode ? (
          <div className="ges-welcome-message__override">
            {content}
            {isInBuilder && (
              <p className="mt-2 text-xs italic opacity-70">
                Editing Makeswift override. Switch Content source back to Show App API to restore the default.
              </p>
            )}
          </div>
        ) : (
          <>
            {title.length > 0 && (
              <h2 className="text-2xl font-semibold md:text-3xl" style={{ color: accent }}>
                {title}
              </h2>
            )}
            {body.length > 0 && <p className="mt-3 text-base leading-relaxed md:text-lg">{body}</p>}
            {isInBuilder && !apiHasContent && (
              <p className="mt-2 text-xs italic opacity-70">
                Show App API returned no welcome message. Component would be hidden at runtime.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
