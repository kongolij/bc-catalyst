'use client';

import { ReactRuntimeProvider } from '@makeswift/runtime/next';
import { type SiteVersion } from '@makeswift/runtime/next';
import { PropsWithChildren } from 'react';

import '~/lib/makeswift/components';
import { runtime } from '~/lib/makeswift/runtime';

export function MakeswiftProvider({
  children,
  siteVersion,
}: PropsWithChildren<{ siteVersion: SiteVersion | null | undefined }>) {
  return (
    <ReactRuntimeProvider runtime={runtime} siteVersion={siteVersion}>
      {children}
    </ReactRuntimeProvider>
  );
}
