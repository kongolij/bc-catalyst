import { Makeswift } from '@makeswift/runtime/next';

import './components';
import { runtime } from './runtime';

export const client = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY!, { runtime });
