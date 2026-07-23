export type CategoryFilter = 'featured' | 'best-selling' | 'all';
export interface BigCommerceCategory {
  entityId: number; name: string; path: string; productCount: number;
  image: { url: string; altText: string } | null;
}
export interface CategoryGridItem {
  id: string; source: 'bigcommerce' | 'manual'; categoryId?: number;
  title: string; path: string; imageUrl: string; productCount?: number;
  titleOverride?: string; hrefOverride?: string;
}
export interface CategoryGridValue {
  version: 1; filter: CategoryFilter; columns: 2 | 3 | 4 | 5; items: CategoryGridItem[];
}
