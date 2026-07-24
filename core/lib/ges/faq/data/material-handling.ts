import type { FaqCategoryFile } from './types';

const categoryId = 'material-handling';

export const materialHandling: FaqCategoryFile = {
  category: { id: categoryId, title: 'Material Handling/Drayage', sortOrder: 20 },
  items: Array.from({ length: 14 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `Material Handling — Question ${i + 1}?`,
    answer: `Sample answer for Material Handling question ${i + 1}. Replace with real content.`,
  })),
};
