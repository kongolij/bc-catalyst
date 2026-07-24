'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, type ReactNode } from 'react';

import { FaqProvider } from './context';

interface Props {
  className?: string;
  title?: string;
  defaultCategorySlug?: string;
  sidebar?: ReactNode;
  content?: ReactNode;
  syncToUrl?: boolean;
}

function UrlSyncedProvider({
  children,
  defaultCategorySlug,
  syncToUrl,
}: {
  children: ReactNode;
  defaultCategorySlug?: string;
  syncToUrl: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSlug = syncToUrl ? searchParams.get('category') : null;

  const handleChange = useCallback(
    (slug: string | null) => {
      if (!syncToUrl) return;
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (slug) {
        params.set('category', slug);
      } else {
        params.delete('category');
      }
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    },
    [router, searchParams, syncToUrl],
  );

  return (
    <FaqProvider
      defaultCategorySlug={defaultCategorySlug}
      initialSlug={initialSlug}
      onActiveSlugChange={handleChange}
    >
      {children}
    </FaqProvider>
  );
}

export function GesFaqPageClient({
  className,
  title,
  defaultCategorySlug,
  sidebar,
  content,
  syncToUrl = true,
}: Props) {
  return (
    <Suspense
      fallback={
        <FaqProvider defaultCategorySlug={defaultCategorySlug}>
          <FaqPageLayout className={className} title={title} sidebar={sidebar} content={content} />
        </FaqProvider>
      }
    >
      <UrlSyncedProvider defaultCategorySlug={defaultCategorySlug} syncToUrl={syncToUrl}>
        <FaqPageLayout className={className} title={title} sidebar={sidebar} content={content} />
      </UrlSyncedProvider>
    </Suspense>
  );
}

function FaqPageLayout({
  className,
  title,
  sidebar,
  content,
}: {
  className?: string;
  title?: string;
  sidebar?: ReactNode;
  content?: ReactNode;
}) {
  return (
    <section
      className={['ges-faq-poc', className].filter(Boolean).join(' ')}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {title ? <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>{title}</h1> : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 260px) 1fr',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <aside>{sidebar}</aside>
        <div>{content}</div>
      </div>
    </section>
  );
}
