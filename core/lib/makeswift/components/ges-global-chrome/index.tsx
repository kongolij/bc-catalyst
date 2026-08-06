import { MakeswiftComponent } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';

import { client as makeswiftClient } from '~/lib/makeswift/client';
import { GesComposableFooterClient } from '~/lib/makeswift/components/ges-composable-footer/client';
import { GES_COMPOSABLE_FOOTER_COMPONENT_TYPE } from '~/lib/makeswift/components/ges-composable-footer/register';
import { GesShowHeaderClient } from '~/lib/makeswift/components/ges-show-header/client';
import { GES_SHOW_HEADER_COMPONENT_TYPE } from '~/lib/makeswift/components/ges-show-header/register';

export const GES_GLOBAL_HEADER_SNAPSHOT_ID = 'ges-global-show-header';
export const GES_GLOBAL_FOOTER_SNAPSHOT_ID = 'ges-global-show-footer';

export async function GlobalGesHeader() {
  const snapshot = await makeswiftClient
    .getComponentSnapshot(GES_GLOBAL_HEADER_SNAPSHOT_ID, {
      siteVersion: await getSiteVersion(),
    })
    .catch((err) => {
      console.warn('[ges-global-chrome] failed to fetch header snapshot', err);

      return null;
    });

  if (snapshot == null) return <GesShowHeaderClient />;

  return (
    <MakeswiftComponent
      description="Global editable Header. Changes affect every page using the default Catalyst layout."
      label="Global GES Show Header"
      snapshot={snapshot}
      type={GES_SHOW_HEADER_COMPONENT_TYPE}
    />
  );
}

export async function GlobalGesFooter() {
  const snapshot = await makeswiftClient
    .getComponentSnapshot(GES_GLOBAL_FOOTER_SNAPSHOT_ID, {
      siteVersion: await getSiteVersion(),
    })
    .catch((err) => {
      console.warn('[ges-global-chrome] failed to fetch footer snapshot', err);

      return null;
    });

  if (snapshot == null) return <GesComposableFooterClient />;

  return (
    <MakeswiftComponent
      description="Global editable Footer. Changes affect every page using the default Catalyst layout."
      label="Global GES Show Footer"
      snapshot={snapshot}
      type={GES_COMPOSABLE_FOOTER_COMPONENT_TYPE}
    />
  );
}
