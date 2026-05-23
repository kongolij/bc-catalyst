'use client';

import { Printer } from 'lucide-react';

type PrintButtonProps = {
  className?: string;
};

export function PrintButton({ className }: PrintButtonProps) {
  const handlePrint = () => {
    if (typeof window === 'undefined') return;

    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        .no-print, header, footer, nav { display: none !important; }
        html, body {
          margin: 0 !important;
          padding: 10px !important;
          background: #fff !important;
          color: #000 !important;
          font-size: 12pt;
          line-height: 1.5;
        }
        @page { size: A4; margin: 6pt; }
        * { box-shadow: none !important; }
      }
    `;

    document.head.appendChild(style);
    window.print();

    setTimeout(() => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    }, 1000);
  };

  return (
    <button
      aria-label="Print"
      className={`no-print flex items-center justify-center rounded-sm border border-black bg-white p-2 transition-colors hover:bg-yellow-300 ${className ?? ''}`}
      onClick={handlePrint}
    >
      <Printer className="h-5 w-5" />
    </button>
  );
}
