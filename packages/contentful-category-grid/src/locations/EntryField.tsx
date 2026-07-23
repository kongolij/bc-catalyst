import type { FieldExtensionSDK } from '@contentful/app-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BigCommerceCategory, CategoryFilter, CategoryGridItem, CategoryGridValue } from '../types';

const emptyValue: CategoryGridValue = { version: 1, filter: 'featured', columns: 4, items: [] };

export function EntryField({ sdk }: { sdk: FieldExtensionSDK }) {
  const initial = parseValue(sdk.field.getValue());
  const [value, setValue] = useState(initial);
  const [available, setAvailable] = useState<BigCommerceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [manual, setManual] = useState({ title: '', path: '', imageUrl: '' });
  const parameters = sdk.parameters.installation as { catalogApiBaseUrl?: string };
  const baseUrl = (parameters.catalogApiBaseUrl ?? '').replace(/\/+$/, '');

  const save = useCallback((next: CategoryGridValue) => {
    setValue(next);
    void sdk.field.setValue(next);
  }, [sdk]);

  const load = useCallback(async (filter: CategoryFilter, initialize = false) => {
    if (!baseUrl) { setError('Set the Catalyst storefront URL in the app configuration.'); return; }
    setLoading(true); setError('');
    try {
      const query = filter === 'all' ? '' : '?filter=' + encodeURIComponent(filter);
      const response = await fetch(baseUrl + '/api/bc/categories/top-level' + query);
      if (!response.ok) throw new Error('Category API returned HTTP ' + response.status);
      const result = await response.json() as { categories?: BigCommerceCategory[] };
      const categories = result.categories ?? [];
      setAvailable(categories);
      if (initialize && value.items.length === 0) save({ ...value, filter, items: categories.map(toItem) });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load categories.');
    } finally { setLoading(false); }
  }, [baseUrl, save, value]);

  useEffect(() => {
    sdk.window.startAutoResizer();
    const detach = sdk.field.onValueChanged((next) => setValue(parseValue(next)));
    void load(initial.filter, initial.items.length === 0);
    return () => { detach(); sdk.window.stopAutoResizer(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  const unused = useMemo(() => {
    const ids = new Set(value.items.map((item) => item.categoryId));
    return available.filter((category) => !ids.has(category.entityId));
  }, [available, value.items]);

  const patchItem = (id: string, patch: Partial<CategoryGridItem>) =>
    save({ ...value, items: value.items.map((item) => item.id === id ? { ...item, ...patch } : item) });

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.items.length) return;
    const items = [...value.items];
    [items[index], items[target]] = [items[target]!, items[index]!];
    save({ ...value, items });
  };

  const dropBefore = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const items = [...value.items];
    const from = items.findIndex((item) => item.id === draggedId);
    const to = items.findIndex((item) => item.id === targetId);
    const moved = from >= 0 ? items.splice(from, 1)[0] : undefined;
    if (moved && to >= 0) { items.splice(to, 0, moved); save({ ...value, items }); }
    setDraggedId(null);
  };

  const addBigCommerce = () => {
    const category = available.find((item) => String(item.entityId) === selectedId);
    if (!category) return;
    save({ ...value, items: [...value.items, toItem(category)] }); setSelectedId('');
  };

  const addManual = () => {
    if (!manual.title.trim() || !manual.path.trim()) return;
    save({ ...value, items: [...value.items, {
      id: 'manual-' + crypto.randomUUID(), source: 'manual', title: manual.title.trim(),
      path: manual.path.trim(), imageUrl: manual.imageUrl.trim(),
    }] });
    setManual({ title: '', path: '', imageUrl: '' });
  };

  return <main className="shell">
    <header className="editor-header"><div><h1>GES Category Grid</h1>
      <p>Load BigCommerce categories, add manual cards, and drag into display order.</p></div>
      <span className="badge">{value.items.length} cards</span>
    </header>

    <section className="toolbar">
      <label>Source<select value={value.filter} onChange={(e) => {
        const filter = e.target.value as CategoryFilter; save({ ...value, filter }); void load(filter);
      }}>
        <option value="featured">Categories with featured products</option>
        <option value="best-selling">Categories with best-selling products</option>
        <option value="all">All top-level categories</option>
      </select></label>
      <label>Columns<select value={value.columns} onChange={(e) => save({ ...value, columns: Number(e.target.value) as 2 | 3 | 4 | 5 })}>
        {[2,3,4,5].map((count) => <option key={count}>{count}</option>)}
      </select></label>
      <button className="button" disabled={loading} onClick={() => void load(value.filter)} type="button">{loading ? 'Loading…' : 'Refresh'}</button>
    </section>
    {error ? <div className="error">{error}</div> : null}

    <section className="add-panel">
      <div><h2>Add BigCommerce category</h2><div className="inline">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select a category…</option>
          {unused.map((category) => <option key={category.entityId} value={category.entityId}>{category.name} ({category.productCount})</option>)}
        </select><button className="button primary" disabled={!selectedId} onClick={addBigCommerce} type="button">Add</button>
      </div></div>
      <div><h2>Add manual card</h2><div className="manual">
        <input onChange={(e) => setManual({ ...manual, title: e.target.value })} placeholder="Title" value={manual.title} />
        <input onChange={(e) => setManual({ ...manual, path: e.target.value })} placeholder="/link or https://…" value={manual.path} />
        <input onChange={(e) => setManual({ ...manual, imageUrl: e.target.value })} placeholder="Image URL (optional)" value={manual.imageUrl} />
        <button className="button primary" disabled={!manual.title.trim() || !manual.path.trim()} onClick={addManual} type="button">Add manual</button>
      </div></div>
    </section>

    <section className="list">
      {value.items.map((item, index) => <article className={draggedId === item.id ? 'row dragging' : 'row'}
        draggable key={item.id} onDragEnd={() => setDraggedId(null)} onDragOver={(e) => e.preventDefault()}
        onDragStart={() => setDraggedId(item.id)} onDrop={() => dropBefore(item.id)}>
        <span className="handle">??</span>
        <div className="thumb">{item.imageUrl ? <img alt="" src={item.imageUrl} /> : <span>No image</span>}</div>
        <div className="main"><strong>{item.titleOverride || item.title}</strong>
          <small>{item.source === 'bigcommerce' ? 'BigCommerce #' + item.categoryId : 'Manual'}</small>
          <code>{item.hrefOverride || item.path}</code></div>
        <div className="overrides">{item.source === 'bigcommerce' ? <>
          <input onChange={(e) => patchItem(item.id, { titleOverride: e.target.value })} placeholder="Title override" value={item.titleOverride ?? ''} />
          <input onChange={(e) => patchItem(item.id, { hrefOverride: e.target.value })} placeholder="Link override" value={item.hrefOverride ?? ''} />
        </> : null}</div>
        <div className="actions">
          <button disabled={index === 0} onClick={() => move(index, -1)} type="button">?</button>
          <button disabled={index === value.items.length - 1} onClick={() => move(index, 1)} type="button">?</button>
          <button className="delete" onClick={() => save({ ...value, items: value.items.filter((entry) => entry.id !== item.id) })} type="button">×</button>
        </div>
      </article>)}
      {!value.items.length ? <p className="empty">No categories selected.</p> : null}
    </section>

    <section className="panel"><h2>Grid preview</h2>
      <div className="preview" style={{ gridTemplateColumns: 'repeat(' + value.columns + ',minmax(0,1fr))' }}>
        {value.items.map((item) => <div className="card" key={item.id}>
          {item.imageUrl ? <img alt="" src={item.imageUrl} /> : <div className="placeholder">No image</div>}
          <strong>{item.titleOverride || item.title}</strong></div>)}
      </div>
    </section>
  </main>;
}

function toItem(category: BigCommerceCategory): CategoryGridItem {
  return { id: 'bc-' + category.entityId, source: 'bigcommerce', categoryId: category.entityId,
    title: category.name, path: category.path, imageUrl: category.image?.url ?? '', productCount: category.productCount };
}
function parseValue(input: unknown): CategoryGridValue {
  if (!input || typeof input !== 'object') return emptyValue;
  const value = input as Partial<CategoryGridValue>;
  if (!Array.isArray(value.items)) return emptyValue;
  return { version: 1, filter: value.filter === 'all' || value.filter === 'best-selling' ? value.filter : 'featured',
    columns: value.columns === 2 || value.columns === 3 || value.columns === 5 ? value.columns : 4, items: value.items };
}
