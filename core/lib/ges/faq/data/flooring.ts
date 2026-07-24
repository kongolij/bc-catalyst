import type { FaqCategoryFile } from './types';

const categoryId = 'flooring';

export const flooring: FaqCategoryFile = {
  category: { id: categoryId, title: 'Flooring', sortOrder: 40 },
  items: [
    {
      id: 'flooring-001',
      categoryId,
      question: 'Is install and dismantle included in the cost of GES carpet?',
      answer: 'Yes. Install and dismantle labor is bundled with every GES carpet rental.',
    },
    {
      id: 'flooring-002',
      categoryId,
      question:
        'I have a booth that is smaller than the minimum of 100 square feet that is required for all Value and Premium carpet packages, how do I order or my booth?',
      answer:
        'Contact your show representative to request a custom-cut package for booths under 100 sq ft.',
    },
    {
      id: 'flooring-003',
      categoryId,
      question: 'I see the venue is not carpeted, is Flooring Mandatory?',
      answer:
        'Flooring requirements vary by show — please refer to your Exhibitor Kit for specifics.',
    },
  ],
};
