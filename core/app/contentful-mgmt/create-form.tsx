'use client';

import { useMemo, useState } from 'react';

import type { ContentType } from '~/lib/contentful/cma';

interface Props {
  contentTypes: ContentType[];
  defaultContentTypeId: string;
}

type FieldValue = string;

export function CreateEntryForm({ contentTypes, defaultContentTypeId }: Props) {
  const initialId =
    contentTypes.find((c) => c.id === defaultContentTypeId)?.id ?? contentTypes[0]?.id ?? '';

  const [contentTypeId, setContentTypeId] = useState(initialId);
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; url?: string } | null>(null);

  const selected = useMemo(
    () => contentTypes.find((c) => c.id === contentTypeId) ?? null,
    [contentTypes, contentTypeId],
  );

  const editableFields = useMemo(
    () => (selected?.fields ?? []).filter((f) => ['Symbol', 'Text'].includes(f.type)),
    [selected],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setResult(null);

    const fields: Record<string, unknown> = {};
    for (const f of editableFields) {
      const v = values[f.id];
      if (v !== undefined && v !== '') fields[f.id] = v;
    }

    try {
      const res = await fetch('/api/contentful/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentTypeId, fields }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, message: data.error ?? `HTTP ${res.status}` });
      } else {
        setResult({
          ok: true,
          message: `Created draft entry ${data.entry.id}`,
          url: data.entry.webUrl,
        });
      }
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 16 }}>
      <label style={{ display: 'block', marginBottom: 12 }}>
        <span style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Content model</span>
        <select
          value={contentTypeId}
          onChange={(e) => {
            setContentTypeId(e.target.value);
            setValues({});
            setResult(null);
          }}
          style={{ padding: 6, minWidth: 320 }}
        >
          {contentTypes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.id})
            </option>
          ))}
        </select>
      </label>

      {selected && (
        <>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
            {selected.description || 'No description'} — {selected.fields.length} fields total,{' '}
            {editableFields.length} text-editable here.
          </p>
          {editableFields.length === 0 ? (
            <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
              No simple text fields on this model. Skeleton only handles Symbol/Text for now — we'll
              extend as we refine per block.
            </p>
          ) : (
            editableFields.map((f) => (
              <label key={f.id} style={{ display: 'block', marginBottom: 10 }}>
                <span style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
                  {f.name} <code style={{ color: '#888' }}>({f.id})</code>
                  {f.required ? <span style={{ color: '#c00' }}> *</span> : null}
                </span>
                {f.type === 'Text' ? (
                  <textarea
                    value={values[f.id] ?? ''}
                    onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: 6, fontFamily: 'inherit' }}
                  />
                ) : (
                  <input
                    type="text"
                    value={values[f.id] ?? ''}
                    onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                    style={{ width: '100%', padding: 6 }}
                  />
                )}
              </label>
            ))
          )}
        </>
      )}

      <button
        type="submit"
        disabled={busy || !selected}
        style={{
          marginTop: 8,
          padding: '10px 16px',
          background: busy ? '#999' : '#0a2540',
          color: 'white',
          border: 'none',
          cursor: busy ? 'default' : 'pointer',
          fontSize: 14,
        }}
      >
        {busy ? 'Creating…' : 'Create Landing Page in Contentful'}
      </button>

      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: result.ok ? '#e8f5e9' : '#fdecea',
            border: `1px solid ${result.ok ? '#a5d6a7' : '#f5c2c0'}`,
            fontSize: 13,
          }}
        >
          {result.message}
          {result.url && (
            <div style={{ marginTop: 6 }}>
              <a href={result.url} target="_blank" rel="noreferrer">
                Open in Contentful ↗
              </a>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
