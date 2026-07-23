import { NextRequest, NextResponse } from 'next/server';

import { createEntry } from '~/lib/contentful/cma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contentTypeId =
      body.contentTypeId ?? process.env.CONTENTFUL_CONTENT_TYPE_ID;
    if (!contentTypeId) {
      return NextResponse.json(
        { error: 'contentTypeId is required (body or CONTENTFUL_CONTENT_TYPE_ID env)' },
        { status: 400 },
      );
    }
    const fields = body.fields ?? {};
    const entry = await createEntry({ contentTypeId, fields });
    return NextResponse.json({ entry });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/contentful/entries]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
