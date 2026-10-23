'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { usePathname } from '~/i18n/routing';
import { getCookieValue } from '~/lib/client-cookies';

import { isShowCode, resolveShowLink, type ShowLink, type ShowLinkInput } from './show-link';

/**
 * Client hook: resolves editor links inside the show being viewed.
 *
 * Project code, in order: the prop passed by the page, the first numeric URL
 * segment, then the `project_code` cookie set by middlewares/with-routes.ts.
 * The cookie is read after mount (document is not available on the server).
 * @param {string | number | null} [projectCode] Show number, when the component already has it.
 * @returns {object} The show used (`projectCode`) and `resolve(link)`.
 */
export function useShowLink(projectCode?: string | number | null) {
  const pathname = usePathname();
  const [cookieCode, setCookieCode] = useState<string | null>(null);

  useEffect(() => {
    const value = getCookieValue('project_code');

    setCookieCode(isShowCode(value) ? value : null);
  }, [pathname]);

  const code = useMemo(() => {
    if (projectCode != null && String(projectCode).trim() !== '') return String(projectCode).trim();

    const fromPath = pathname
      .split('/')
      .filter(Boolean)
      .slice(0, 2)
      .find((s) => isShowCode(s));

    return fromPath ?? cookieCode;
  }, [projectCode, pathname, cookieCode]);

  const resolve = useCallback(
    (link: ShowLinkInput): ShowLink => resolveShowLink(link, code),
    [code],
  );

  return { projectCode: code, resolve };
}
