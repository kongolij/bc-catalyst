/**
 * Show-scoped links.
 *
 * Editors enter links without a show number. At render time:
 * - a relative link (/move-in-info) gets the current show: /12345/move-in-info
 * - the placeholder /projectcode/ is replaced with the current show
 * - a full URL (https://..., //..., mailto:, tel:) is left exactly as entered
 *
 * Pure function: no React, no cookies, no window. Use `useShowLink` on the client
 * or call `resolveShowLink` on the server with the page's project code.
 */

export interface ShowLink {
  /** Final href, or null when nothing was entered. */
  href: string | null;
  target?: '_blank' | '_self';
}

export type ShowLinkInput =
  | string
  | { href?: string | null; target?: string | null }
  | null
  | undefined;

/** Site-wide pages that never get a show prefix. */
export const SITE_WIDE_PATHS = [
  'account',
  'blog',
  'cart',
  'change-password',
  'checkout',
  'compare',
  'findcompany',
  'forms',
  'log-out',
  'login',
  'product',
  'register',
  'search',
  'shows',
  'wishlist',
];

const PLACEHOLDER = 'projectcode';
const SHOW_CODE_RE = /^\d+$/;
const HAS_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

/**
 * True when the value is a show number (positive integer).
 * @param {string | null} [value] Value to test.
 * @returns {boolean} Whether the value is a show number.
 */
export function isShowCode(value?: string | null): boolean {
  return !!value && SHOW_CODE_RE.test(value) && Number(value) > 0;
}

function readLink(link: ShowLinkInput): ShowLink & { value: string } {
  if (typeof link === 'string') return { value: link.trim(), href: null };

  const rawTarget = link?.target;
  const target = rawTarget === '_blank' || rawTarget === '_self' ? rawTarget : undefined;

  return { value: (link?.href ?? '').trim(), href: null, target };
}

// Full URL, mailto:, tel:, anchors and query-only links: leave as entered.
function isLeftAsEntered(value: string): boolean {
  return (
    HAS_SCHEME_RE.test(value) ||
    value.startsWith('//') ||
    value.startsWith('#') ||
    value.startsWith('?')
  );
}

// Replace /projectcode/ anywhere in the path (any capitalisation); drop it when no show is known.
function replacePlaceholder(segment: string, code: string): string[] {
  if (segment.toLowerCase() !== PLACEHOLDER) return [segment];

  return code ? [code] : [];
}

/**
 * Resolve an editor-entered link for the show being viewed.
 * @param {ShowLinkInput} link A plain string or a Makeswift Link value ({ href, target }).
 * @param {string | number | null} [projectCode] Show number of the page being viewed.
 * @returns {ShowLink} Final href (null when empty) and the editor's target.
 */
export function resolveShowLink(
  link: ShowLinkInput,
  projectCode?: string | number | null,
): ShowLink {
  const { value, target } = readLink(link);

  if (!value) return { href: null };

  if (isLeftAsEntered(value)) return { href: value, target };

  const code = projectCode != null ? String(projectCode).trim() : '';

  // Split off ?query and #hash so only the path is changed.
  const cut = value.search(/[?#]/);
  const path = cut >= 0 ? value.slice(0, cut) : value;
  const rest = cut >= 0 ? value.slice(cut) : '';

  const segments = path
    .split('/')
    .filter((s) => s !== '')
    .flatMap((s) => replacePlaceholder(s, code));

  const first = segments[0]?.toLowerCase() ?? '';

  if (code && !isShowCode(first) && !SITE_WIDE_PATHS.includes(first)) {
    segments.unshift(code);
  }

  const trailingSlash = path.length > 1 && path.endsWith('/') && segments.length > 0;

  return { href: `/${segments.join('/')}${trailingSlash ? '/' : ''}${rest}`, target };
}
