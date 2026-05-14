import { Makeswift } from '@makeswift/runtime/next/server';

export const client = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY!);
