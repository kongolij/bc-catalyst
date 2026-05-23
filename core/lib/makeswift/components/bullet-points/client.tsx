'use client';

interface TextSegment {
  text: string;
  isLink?: boolean;
  href?: string;
  linkColor?: string;
  underline?: boolean;
  fontWeight?: string;
}

interface BulletItem {
  segments?: TextSegment[];
}

interface BulletPointsProps {
  className?: string;
  items: BulletItem[];
  bulletColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
}

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function BulletPoints({
  className = '',
  items = [],
  bulletColor = '#000000',
  textColor = '#000000',
  fontSize = 16,
  fontFamily = 'inherit',
}: BulletPointsProps) {
  return (
    <ul
      className={`m-0 list-none p-0 ${className}`}
      style={{ color: textColor, fontSize: `${fontSize}px`, fontFamily }}
    >
      {items.map((item, index) => (
        <li className="mb-2 flex items-start" key={index}>
          <span
            className="mr-2 mt-1 inline-block"
            style={{ color: bulletColor, fontSize: `${fontSize}px` }}
          >
            •
          </span>
          <span>
            {(item.segments ?? []).map((segment, i) =>
              segment.isLink ? (
                <a
                  href={isValidUrl(segment.href) ? segment.href : undefined}
                  key={i}
                  rel="noopener noreferrer"
                  style={{
                    color: segment.linkColor ?? '#0000EE',
                    textDecoration: segment.underline !== false ? 'underline' : 'none',
                    fontWeight: segment.fontWeight ?? 'normal',
                  }}
                >
                  {segment.text}
                </a>
              ) : (
                <span
                  key={i}
                  style={{
                    textDecoration: segment.underline ? 'underline' : 'none',
                    fontWeight: segment.fontWeight ?? 'normal',
                  }}
                >
                  {segment.text}
                </span>
              ),
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
