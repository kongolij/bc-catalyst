import type { FaqCategoryFile } from './types';

const categoryId = 'general';

export const general: FaqCategoryFile = {
  category: { id: categoryId, title: 'General FAQs', sortOrder: 10 },
  items: [
    {
      id: 'general-001',
      categoryId,
      question: 'Is it safe to order from the site?',
      answer:
        'Yes. All transactions are encrypted end-to-end and payment details are tokenized before being sent to our processor.',
    },
    {
      id: 'general-002',
      categoryId,
      question: 'What are the system requirements to view this site?',
      answer:
        'Any modern browser (Chrome, Edge, Firefox, Safari) released in the last two years.',
    },
    {
      id: 'general-003',
      categoryId,
      question: 'How do I create an account?',
      answer:
        'Click "Account" in the top-right and choose "Create account". You will receive a confirmation email.',
    },
    {
      id: 'general-004',
      categoryId,
      question: 'Do I need an Activation code? Do I need one to sign-up?',
      answer:
        'An activation code is only required for exhibitor portals tied to a specific show.',
    },
    {
      id: 'general-005',
      categoryId,
      question: 'How will I receive my order confirmation?',
      answer:
        'A confirmation email is sent immediately after checkout and a copy is stored under Account → Orders.',
    },
    {
      id: 'general-006',
      categoryId,
      question: 'When will my credit card be charged?',
      answer: 'At the time your order is submitted.',
    },
    {
      id: 'general-007',
      categoryId,
      question: 'Can I pay online with a check?',
      answer: 'eCheck (ACH) is available at checkout for U.S. billing addresses.',
    },
    {
      id: 'general-008',
      categoryId,
      question: 'Can I arrange shipping using GES Logistics?',
      answer: 'Yes — select "GES Logistics" during checkout to receive a shipping quote.',
    },
    {
      id: 'general-009',
      categoryId,
      question: 'How do I track my shipping?',
      answer: 'Tracking numbers appear under Account → Orders once your shipment is picked up.',
    },
    {
      id: 'general-010',
      categoryId,
      question: 'What else should I know about your website?',
      answer: 'Bookmark your show page for quick access to deadlines, deals, and downloads.',
    },
    {
      id: 'general-011',
      categoryId,
      question:
        'After my order has been processed, but I need to make changes, how do I do this?',
      answer: 'Contact your show representative before the discount deadline for changes.',
    },
    {
      id: 'general-012',
      categoryId,
      question: 'Can I start an order now, then come back later to finish it?',
      answer: 'Yes — your cart is saved when you are signed in.',
    },
  ],
};
