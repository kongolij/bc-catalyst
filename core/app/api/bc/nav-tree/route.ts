import { NextResponse } from 'next/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

export const dynamic = 'force-dynamic';

const NavTreeQuery = graphql(`
  query BcNavTree {
    site {
      categoryTree {
        entityId
        name
        path
        children {
          entityId
          name
          path
          children {
            entityId
            name
            path
          }
        }
      }
    }
  }
`);

export async function GET() {
  try {
    const result = await client.fetch({
      document: NavTreeQuery,
      fetchOptions: { next: { revalidate } },
    });

    return NextResponse.json({ tree: result.data.site.categoryTree ?? [] });
  } catch (err) {
    console.error('[/api/bc/nav-tree]', err);

    return NextResponse.json({ error: 'Failed to fetch nav tree' }, { status: 500 });
  }
}
