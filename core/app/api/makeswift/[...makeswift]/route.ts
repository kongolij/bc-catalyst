import { MakeswiftApiHandler } from '@makeswift/runtime/next/server';
import { NextRequest } from 'next/server';

import '~/lib/makeswift/components';
import { runtime } from '~/lib/makeswift/runtime';

export const dynamic = 'force-dynamic';

interface Context {
  params: Promise<{ makeswift: string[] }>;
}

const handler = MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY!, { runtime });

export function GET(req: NextRequest, context: Context) {
  return handler(req, context);
}

export function POST(req: NextRequest, context: Context) {
  return handler(req, context);
}
