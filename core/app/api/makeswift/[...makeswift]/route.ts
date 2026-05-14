import { MakeswiftApiHandler } from '@makeswift/runtime/next/server';

export const dynamic = 'force-dynamic';

export const { GET, POST } = MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY!);
