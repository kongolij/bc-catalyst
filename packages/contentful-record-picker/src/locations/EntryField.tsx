import type { FieldExtensionSDK } from '@contentful/app-sdk';
import { RichTextEditor } from '@contentful/field-editor-rich-text';
import { useEffect, useState } from 'react';

import { mockShowText } from '../data/mock-records';

interface Props {
  sdk: FieldExtensionSDK;
}

export function EntryField({ sdk }: Props) {
  const [ready, setReady] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    sdk.window.startAutoResizer();

    const initialize = async () => {
      const currentValue = sdk.field.getValue();

      if (!isRichTextDocument(currentValue)) {
        await sdk.field.setValue(plainTextToRichText(mockShowText));
      }

      setReady(true);
    };

    void initialize().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      sdk.notifier.error(`Could not load mock Rich Text: ${message}`);
    });

    const detachDisabled = sdk.field.onIsDisabledChanged(setIsDisabled);

    return () => {
      detachDisabled();
      sdk.window.stopAutoResizer();
    };
  }, [sdk]);

  if (!ready) {
    return <p className="editor-loading">Loading Rich Text editor…</p>;
  }

  return (
    <main className="rich-text-shell">
      <RichTextEditor
        isInitiallyDisabled={isDisabled}
        minHeight={320}
        sdk={sdk}
      />
    </main>
  );
}

function plainTextToRichText(value: string) {
  return {
    nodeType: 'document',
    data: {},
    content: value.replace(/\r\n/g, '\n').split('\n').map((line) => ({
      nodeType: 'paragraph',
      data: {},
      content: [{
        nodeType: 'text',
        value: line,
        marks: [],
        data: {},
      }],
    })),
  };
}

function isRichTextDocument(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { nodeType?: unknown; content?: unknown };
  return candidate.nodeType === 'document' && Array.isArray(candidate.content);
}