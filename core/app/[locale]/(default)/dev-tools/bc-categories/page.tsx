import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

import { CopyIdButton } from './copy-id-button';

export const dynamic = 'force-dynamic';

const TopLevelCategoriesQuery = graphql(`
  query DevToolsTopLevelCategories {
    site {
      categoryTree {
        entityId
        name
        path
        productCount
        image {
          url: urlTemplate(lossy: true)
          altText
        }
      }
    }
  }
`);

export default async function BcCategoriesDevTools() {
  const result = await client.fetch({
    document: TopLevelCategoriesQuery,
    fetchOptions: { next: { revalidate } },
  });

  const categories = result.data.site.categoryTree ?? [];

  return (
    <div style={{ maxWidth: 960, margin: '48px auto', padding: '0 16px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>BC Top-Level Categories</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Copy an ID and paste it into the <b>Category ID</b> field on a GES / Category Card.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
            <th style={{ padding: '10px 12px', border: '1px solid #e5e7eb', width: 72 }}>Image</th>
            <th style={{ padding: '10px 12px', border: '1px solid #e5e7eb', width: 90 }}>ID</th>
            <th style={{ padding: '10px 12px', border: '1px solid #e5e7eb' }}>Name</th>
            <th style={{ padding: '10px 12px', border: '1px solid #e5e7eb' }}>Path</th>
            <th style={{ padding: '10px 12px', border: '1px solid #e5e7eb', width: 100 }}>
              Products
            </th>
            <th style={{ padding: '10px 12px', border: '1px solid #e5e7eb', width: 100 }} />
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.entityId}>
              <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb' }}>
                {c.image ? (
                  <img
                    alt={c.image.altText ?? c.name}
                    src={c.image.url.replace('{:size}', '80x80')}
                    style={{ width: 48, height: 48, objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ color: '#9ca3af' }}>—</span>
                )}
              </td>
              <td
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  fontFamily: 'monospace',
                }}
              >
                {c.entityId}
              </td>
              <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb', fontWeight: 600 }}>
                {c.name}
              </td>
              <td
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  color: '#6b7280',
                  fontFamily: 'monospace',
                }}
              >
                {c.path}
              </td>
              <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb' }}>{c.productCount}</td>
              <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb' }}>
                <CopyIdButton value={String(c.entityId)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {categories.length === 0 && (
        <p style={{ marginTop: 24, color: '#6b7280' }}>No top-level categories found.</p>
      )}
    </div>
  );
}
