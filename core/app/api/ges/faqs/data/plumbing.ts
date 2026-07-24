import type { FaqCategoryFile } from './types';

const categoryId = 'plumbing';

export const plumbing: FaqCategoryFile = {
  category: { id: categoryId, title: 'Plumbing', sortOrder: 90 },
  items: Array.from({ length: 4 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `Plumbing — Question ${i + 1}?`,
    answer: `Sample answer for Plumbing question ${i + 1}. Replace with real content.`,
  })),
};
