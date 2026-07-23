import type { AppExtensionSDK } from '@contentful/app-sdk';
import { useEffect } from 'react';

interface Props {
  sdk: AppExtensionSDK;
}

export function AppConfig({ sdk }: Props) {
  useEffect(() => {
    sdk.app.onConfigure(async () => ({
      parameters: {
        dataSource: 'mock',
        contentField: 'showContent',
      },
    }));
    void sdk.app.setReady();
  }, [sdk]);

  return (
    <main className="config-shell">
      <span className="eyebrow">GES proof of concept</span>
      <h1>Editable Show Content</h1>
      <p>This app loads one mock show as a single editable text block and saves changes directly in Contentful.</p>
      <div className="config-grid">
        <section>
          <h2>Content type setup</h2>
          <ol>
            <li>Create a Rich text field with ID <code>showContent</code>.</li>
            <li>Assign this app as that field&apos;s appearance.</li>
            <li>Open an entry and edit the loaded text directly.</li>
          </ol>
        </section>
        <section>
          <h2>How it works</h2>
          <p>The mock content is inserted when the field is empty. After that, the saved Contentful value is loaded.</p>
        </section>
      </div>
      <div className="notice">
        Save the app configuration, then assign the app to the <code>showContent</code> Rich text field under the
        content type&apos;s Appearance settings.
      </div>
    </main>
  );
}