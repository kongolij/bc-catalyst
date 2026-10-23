'use client';

import Link from 'next/link';

import { useShowLink } from '~/lib/show-link/use-show-link';

interface Props {
  className?: string;
  text?: string;
  link?: { href?: string; target?: string };
  fakeShowCode?: string;
}

// Test-only banner: bc-catalyst has no shows, so the show code is typed in the panel.
export function GesShowLinkDemoClient({ className, text, link, fakeShowCode }: Props) {
  const { projectCode, resolve } = useShowLink(fakeShowCode);
  const resolved = resolve(link);

  return (
    <div className={className} style={{ padding: 16, background: '#c8d629', color: '#0a2540' }}>
      {resolved.href ? (
        <Link href={resolved.href} target={resolved.target}>
          {text}
        </Link>
      ) : (
        <span>{text}</span>
      )}
      <div style={{ fontFamily: 'monospace', fontSize: 12, marginTop: 8 }}>
        show: {projectCode ?? '(none)'} · entered: {link?.href || '(empty)'} → href:{' '}
        {resolved.href ?? 'null'}
      </div>
    </div>
  );
}
