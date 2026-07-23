# GES Contentful Category Grid

Contentful configuration:
- App configuration location
- Entry field location
- JSON Object field type
- Content field ID: categoryGrid

Set the public Catalyst storefront URL in the app installation configuration.
The editor calls /api/bc/categories/top-level with featured, best-selling, or all filters.

Build: pnpm --filter @ges/contentful-category-grid build
Upload: pnpm --filter @ges/contentful-category-grid upload
Activate: pnpm --filter @ges/contentful-category-grid activate
