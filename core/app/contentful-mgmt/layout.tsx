import type { PropsWithChildren } from 'react';

import '../../globals.css';

export const metadata = {
  title: 'Contentful Management — POC',
};

export default function ContentfulMgmtLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
