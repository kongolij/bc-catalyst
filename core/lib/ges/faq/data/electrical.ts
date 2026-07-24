import type { FaqCategoryFile } from './types';

const categoryId = 'electrical';

export const electrical: FaqCategoryFile = {
  category: { id: categoryId, title: 'Electrical', sortOrder: 70 },
  items: Array.from({ length: 17 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `Electrical — Question ${i + 1}?`,
    answer: `Sample answer for Electrical question ${i + 1}. Replace with real content.`,
  })),
};
