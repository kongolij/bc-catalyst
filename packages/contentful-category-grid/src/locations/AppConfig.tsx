import type { AppExtensionSDK } from '@contentful/app-sdk';
import { useEffect, useRef, useState } from 'react';
export function AppConfig({ sdk }: { sdk: AppExtensionSDK }) {
  const installed = sdk.parameters.installation as { catalogApiBaseUrl?: string };
  const [baseUrl, setBaseUrl] = useState(installed.catalogApiBaseUrl ?? '');
  const valueRef = useRef(baseUrl);
  useEffect(() => { valueRef.current = baseUrl; }, [baseUrl]);
  useEffect(() => {
    sdk.app.onConfigure(async () => ({ parameters: { catalogApiBaseUrl: valueRef.current.trim().replace(/\/+$/, '') } }));
    void sdk.app.setReady();
  }, [sdk]);
  return <main className="config-shell">
    <span className="eyebrow">GES Contentful App</span><h1>GES Category Grid</h1>
    <p>Configure the Catalyst storefront used to retrieve BigCommerce categories.</p>
    <label className="field-label" htmlFor="api-url">Catalyst storefront URL</label>
    <input className="text-input" id="api-url" onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://your-storefront.example.com" type="url" value={baseUrl} />
    <p className="hint">The app calls /api/bc/categories/top-level. Do not enter a BigCommerce token.</p>
    <section className="panel"><h2>Contentful setup</h2><ol>
      <li>Enable App configuration and Entry field.</li><li>Allow JSON Object fields.</li>
      <li>Create a JSON Object field with ID categoryGrid.</li><li>Assign this app under Appearance.</li>
    </ol></section>
  </main>;
}
