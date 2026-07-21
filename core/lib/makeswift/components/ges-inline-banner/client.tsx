'use client';

import Link from 'next/link';

interface Props {
  className?: string;
  text?: string;
  href?: string;
  background?: string;
  textColor?: string;
}

export function GesInlineBannerClient({
  className,
  text,
  href,
  background = '#c8d629',
  textColor = '#0a2540',
}: Props) {
  if (!text) return null;

  const style = { background, color: textColor };
  const cls = ['ges-inline-banner', className].filter(Boolean).join(' ');

  if (href) {
    return (
      <Link className={cls} href={href} style={style}>
        <span className="ges-inline-banner__text">{text}</span>
      </Link>
    );
  }

  return (
    <div className={cls} style={style}>
      <span className="ges-inline-banner__text">{text}</span>
    </div>
  );
}
