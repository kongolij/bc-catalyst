'use client';

import { useCallback, useMemo } from 'react';

import { usePathname } from '~/i18n/routing';
import { getCookieValue } from '~/lib/client-cookies';

import { isShowCode, resolveShowLink, type ShowLink, type ShowLinkInput } from './show-link';

/**
 * Client hook: resolves editor links inside the show being viewed.
 *
 * Project code, in order: the prop passed by the page, the first numeric URL
 * segment, then the `project_code` cookie set by middlewares/with-routes.ts.
 * @param {string | number | null} [projectCode] Show number, when the component already has it.
 * @returns {object} The show used (`projectCode`) and `resolve(link)`.
 */
export function useShowLink(projectCode?: string | number | null) {
  const pathname = usePathname();

  const code = useMemo(() => {
    if (projectCode != null && String(projectCode).trim() !== '') return String(projectCode).trim();

    const fromPath = pathname
      .split('/')
      .filter(Boolean)
      .slice(0, 2)
      .find((s) => isShowCode(s));

    if (fromPath) return fromPath;

    const fromCookie = getCookieValue('project_code');

    return isShowCode(fromCookie) ? fromCookie : null;
  }, [projectCode, pathname]);

  const resolve = useCallback(
    (link: ShowLinkInput): ShowLink => resolveShowLink(link, code),
    [code],
  );

  return { projectCode: code, resolve };
}
