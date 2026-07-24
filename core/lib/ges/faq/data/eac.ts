import type { FaqCategoryFile } from './types';

const categoryId = 'eac';

export const eac: FaqCategoryFile = {
  category: { id: categoryId, title: 'EAC', sortOrder: 100 },
  items: Array.from({ length: 3 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `EAC — Question ${i + 1}?`,
    answer: `Sample answer for EAC question ${i + 1}. Replace with real content.`,
  })),
};
