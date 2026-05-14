import { MakeswiftApiHandler } from '@makeswift/runtime/next/server';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET(req: NextRequest) {
  return MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY!)(req);
}

export function POST(req: NextRequest) {
  return MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY!)(req);
}
