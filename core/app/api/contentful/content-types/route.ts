import { NextResponse } from 'next/server';

import { listContentTypes } from '~/lib/contentful/cma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await listContentTypes();
    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/contentful/content-types]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
