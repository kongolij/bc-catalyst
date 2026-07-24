import { NextResponse } from 'next/server';

import { FAQ_CATEGORY_FILES } from './data';
import type { FaqCategory, FaqItem } from './data/types';

export const dynamic = 'force-static';

interface FaqCategoryResponse extends FaqCategory {
  count: number;
}

export function GET() {
  const categories: FaqCategoryResponse[] = FAQ_CATEGORY_FILES.map((f) => ({
    ...f.category,
    count: f.items.length,
  }));
  const items: FaqItem[] = FAQ_CATEGORY_FILES.flatMap((f) => f.items);
  return NextResponse.json({ categories, items });
}
