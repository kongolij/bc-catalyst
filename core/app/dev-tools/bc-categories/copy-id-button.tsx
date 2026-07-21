'use client';

import { useState } from 'react';

export function CopyIdButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = () => {
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        border: '1px solid #0e2340',
        borderRadius: 4,
        background: copied ? '#C9E252' : '#fff',
        color: '#0e2340',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 600,
      }}
      type="button"
    >
      {copied ? 'Copied!' : 'Copy ID'}
    </button>
  );
}
