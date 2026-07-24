import type { FaqCategoryFile } from './types';

const categoryId = 'exhibit-system';

export const exhibitSystem: FaqCategoryFile = {
  category: { id: categoryId, title: 'Exhibit System+', sortOrder: 30 },
  items: Array.from({ length: 9 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `Exhibit System+ — Question ${i + 1}?`,
    answer: `Sample answer for Exhibit System+ question ${i + 1}. Replace with real content.`,
  })),
};
