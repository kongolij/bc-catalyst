import { NextResponse } from 'next/server';

import { client } from '~/lib/makeswift/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pages = await client.getPages().toArray();

    return NextResponse.json({
      pages: pages.map((p) => ({ path: p.path, title: p.title ?? p.path })),
    });
  } catch (err) {
    console.error('[/api/makeswift/pages]', err);

    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
