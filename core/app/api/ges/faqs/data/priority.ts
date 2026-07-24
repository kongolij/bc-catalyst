import type { FaqCategoryFile } from './types';

const categoryId = 'priority';

export const priority: FaqCategoryFile = {
  category: { id: categoryId, title: 'Priority+', sortOrder: 50 },
  items: Array.from({ length: 12 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `Priority+ — Question ${i + 1}?`,
    answer: `Sample answer for Priority+ question ${i + 1}. Replace with real content.`,
  })),
};
