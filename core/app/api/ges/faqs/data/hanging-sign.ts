import type { FaqCategoryFile } from './types';

const categoryId = 'hanging-sign';

export const hangingSign: FaqCategoryFile = {
  category: { id: categoryId, title: 'Hanging Sign', sortOrder: 80 },
  items: Array.from({ length: 18 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `Hanging Sign — Question ${i + 1}?`,
    answer: `Sample answer for Hanging Sign question ${i + 1}. Replace with real content.`,
  })),
};
