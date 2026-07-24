import type { FaqCategoryFile } from './types';

const categoryId = 'orders-payments';

export const ordersPayments: FaqCategoryFile = {
  category: { id: categoryId, title: 'Orders, Payments and Invoices', sortOrder: 110 },
  items: Array.from({ length: 3 }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `Orders, Payments and Invoices — Question ${i + 1}?`,
    answer: `Sample answer for Orders, Payments and Invoices question ${i + 1}. Replace with real content.`,
  })),
};
