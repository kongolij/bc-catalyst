'use client';

import { type ReactNode, useEffect, useRef } from 'react';

interface Props {
  headline: ReactNode;
  className?: string;
}

export function CustomText({ headline, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      const isSameOrigin = href?.startsWith('/') || href?.startsWith(window.location.origin);
      if (isSameOrigin) {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 200);
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {headline}
    </div>
  );
}
