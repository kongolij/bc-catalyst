export interface FaqCategory {
  id: string;
  title: string;
  sortOrder: number;
}

export interface FaqItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
}

export interface FaqCategoryFile {
  category: FaqCategory;
  items: FaqItem[];
}
