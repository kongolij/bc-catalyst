import type { FaqCategoryFile } from './types';

const categoryId = 'ges-logistics';

export const gesLogistics: FaqCategoryFile = {
  category: { id: categoryId, title: 'GES Logistics', sortOrder: 60 },
  items: Array.from({ length: 5 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `GES Logistics — Question ${i + 1}?`,
    answer: `Sample answer for GES Logistics question ${i + 1}. Replace with real content.`,
  })),
};
