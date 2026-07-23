import { listContentTypes } from '~/lib/contentful/cma';

import { CreateEntryForm } from './create-form';

export const dynamic = 'force-dynamic';

export default async function ContentfulMgmtPage() {
  const defaultCtId = process.env.CONTENTFUL_CONTENT_TYPE_ID ?? '';

  let contentTypes: Awaited<ReturnType<typeof listContentTypes>> = [];
  let loadError: string | null = null;

  try {
    contentTypes = await listContentTypes();
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <main style={{ maxWidth: 960, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Contentful Management — POC</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Create a draft entry in Contentful against a content model. Skeleton — refine per block later.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Environment</h2>
        <ul style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>
          <li>Space: <code>{process.env.CONTENTFUL_SPACE_ID ?? '(missing)'}</code></li>
          <li>Environment: <code>{process.env.CONTENTFUL_ENVIRONMENT_ID ?? 'master'}</code></li>
          <li>Default locale: <code>{process.env.CONTENTFUL_DEFAULT_LOCALE ?? 'en-US'}</code></li>
          <li>Default content type: <code>{defaultCtId || '(not set)'}</code></li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Content Models</h2>
        {loadError ? (
          <pre
            style={{
              background: '#fdecea',
              border: '1px solid #f5c2c0',
              padding: 12,
              fontSize: 12,
              whiteSpace: 'pre-wrap',
            }}
          >
            {loadError}
          </pre>
        ) : contentTypes.length === 0 ? (
          <p style={{ color: '#888' }}>No content types found.</p>
        ) : (
          <CreateEntryForm contentTypes={contentTypes} defaultContentTypeId={defaultCtId} />
        )}
      </section>
    </main>
  );
}
