import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

interface FaqCategory {
  id: string;
  title: string;
  count: number;
  sortOrder: number;
}

interface FaqItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
}

const CATEGORIES: FaqCategory[] = [
  { id: 'general', title: 'General FAQs', count: 12, sortOrder: 10 },
  { id: 'material-handling', title: 'Material Handling/Drayage', count: 14, sortOrder: 20 },
  { id: 'exhibit-system', title: 'Exhibit System+', count: 9, sortOrder: 30 },
  { id: 'flooring', title: 'Flooring', count: 3, sortOrder: 40 },
  { id: 'priority', title: 'Priority+', count: 12, sortOrder: 50 },
  { id: 'ges-logistics', title: 'GES Logistics', count: 5, sortOrder: 60 },
  { id: 'electrical', title: 'Electrical', count: 17, sortOrder: 70 },
  { id: 'hanging-sign', title: 'Hanging Sign', count: 18, sortOrder: 80 },
  { id: 'plumbing', title: 'Plumbing', count: 4, sortOrder: 90 },
  { id: 'eac', title: 'EAC', count: 3, sortOrder: 100 },
  { id: 'orders-payments', title: 'Orders, Payments and Invoices', count: 3, sortOrder: 110 },
];

const GENERAL_ITEMS: FaqItem[] = [
  {
    id: 'general-001',
    categoryId: 'general',
    question: 'Is it safe to order from the site?',
    answer:
      'Yes. All transactions are encrypted end-to-end and payment details are tokenized before being sent to our processor.',
  },
  {
    id: 'general-002',
    categoryId: 'general',
    question: 'What are the system requirements to view this site?',
    answer: 'Any modern browser (Chrome, Edge, Firefox, Safari) released in the last two years.',
  },
  {
    id: 'general-003',
    categoryId: 'general',
    question: 'How do I create an account?',
    answer: 'Click "Account" in the top-right and choose "Create account". You will receive a confirmation email.',
  },
  {
    id: 'general-004',
    categoryId: 'general',
    question: 'Do I need an Activation code? Do I need one to sign-up?',
    answer: 'An activation code is only required for exhibitor portals tied to a specific show.',
  },
  {
    id: 'general-005',
    categoryId: 'general',
    question: 'How will I receive my order confirmation?',
    answer: 'A confirmation email is sent immediately after checkout and a copy is stored under Account → Orders.',
  },
  {
    id: 'general-006',
    categoryId: 'general',
    question: 'When will my credit card be charged?',
    answer: 'At the time your order is submitted.',
  },
  {
    id: 'general-007',
    categoryId: 'general',
    question: 'Can I pay online with a check?',
    answer: 'eCheck (ACH) is available at checkout for U.S. billing addresses.',
  },
  {
    id: 'general-008',
    categoryId: 'general',
    question: 'Can I arrange shipping using GES Logistics?',
    answer: 'Yes — select "GES Logistics" during checkout to receive a shipping quote.',
  },
  {
    id: 'general-009',
    categoryId: 'general',
    question: 'How do I track my shipping?',
    answer: 'Tracking numbers appear under Account → Orders once your shipment is picked up.',
  },
  {
    id: 'general-010',
    categoryId: 'general',
    question: 'What else should I know about your website?',
    answer: 'Bookmark your show page for quick access to deadlines, deals, and downloads.',
  },
  {
    id: 'general-011',
    categoryId: 'general',
    question: 'After my order has been processed, but I need to make changes, how do I do this?',
    answer: 'Contact your show representative before the discount deadline for changes.',
  },
  {
    id: 'general-012',
    categoryId: 'general',
    question: 'Can I start an order now, then come back later to finish it?',
    answer: 'Yes — your cart is saved when you are signed in.',
  },
];

const FLOORING_ITEMS: FaqItem[] = [
  {
    id: 'flooring-001',
    categoryId: 'flooring',
    question: 'Is install and dismantle included in the cost of GES carpet?',
    answer: 'Yes. Install and dismantle labor is bundled with every GES carpet rental.',
  },
  {
    id: 'flooring-002',
    categoryId: 'flooring',
    question:
      'I have a booth that is smaller than the minimum of 100 square feet that is required for all Value and Premium carpet packages, how do I order or my booth?',
    answer: 'Contact your show representative to request a custom-cut package for booths under 100 sq ft.',
  },
  {
    id: 'flooring-003',
    categoryId: 'flooring',
    question: 'I see the venue is not carpeted, is Flooring Mandatory?',
    answer: 'Flooring requirements vary by show — please refer to your Exhibitor Kit for specifics.',
  },
];

// Generate placeholder items for the remaining categories so counts + rendering align.
function generatePlaceholderItems(categoryId: string, count: number, prefix: string): FaqItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${categoryId}-${String(i + 1).padStart(3, '0')}`,
    categoryId,
    question: `${prefix} — Question ${i + 1}?`,
    answer: `Sample answer for ${prefix} question ${i + 1}. Replace with real content when the upstream FAQ API is wired in.`,
  }));
}

const ITEMS: FaqItem[] = [
  ...GENERAL_ITEMS,
  ...generatePlaceholderItems('material-handling', 14, 'Material Handling'),
  ...generatePlaceholderItems('exhibit-system', 9, 'Exhibit System+'),
  ...FLOORING_ITEMS,
  ...generatePlaceholderItems('priority', 12, 'Priority+'),
  ...generatePlaceholderItems('ges-logistics', 5, 'GES Logistics'),
  ...generatePlaceholderItems('electrical', 17, 'Electrical'),
  ...generatePlaceholderItems('hanging-sign', 18, 'Hanging Sign'),
  ...generatePlaceholderItems('plumbing', 4, 'Plumbing'),
  ...generatePlaceholderItems('eac', 3, 'EAC'),
  ...generatePlaceholderItems('orders-payments', 3, 'Orders, Payments and Invoices'),
];

export function GET() {
  return NextResponse.json({ categories: CATEGORIES, items: ITEMS });
}
