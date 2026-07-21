'use client';

interface Props {
  className?: string;
  label?: string;
  link?: { href?: string; target?: string };
  variant?: 'primary' | 'secondary' | 'link';
}

export function GesActionButtonClient({
  className,
  label,
  link,
  variant = 'primary',
}: Props) {
  if (!label) return null;
  const cls = ['ges-btn', `ges-btn--${variant}`, className].filter(Boolean).join(' ');
  const href = link?.href;
  const target = link?.target;
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

  if (!href) {
    return (
      <button type="button" className={cls}>
        {label}
      </button>
    );
  }
  return (
    <a href={href} target={target} rel={rel} className={cls}>
      {label}
    </a>
  );
}
