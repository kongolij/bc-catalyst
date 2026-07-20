'use client';

import { useState } from 'react';

interface Props {
  label?: string;
  getText: () => string;
}

export function CopyHelper({ label = 'Copy API defaults', getText }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className="ges-copy-helper" onClick={onClick} type="button">
      {copied ? 'Copied ✓' : label}
    </button>
  );
}
