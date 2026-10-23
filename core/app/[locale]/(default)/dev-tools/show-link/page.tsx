import { ShowLinkTester } from './show-link-tester';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ show?: string }>;
}

// Dev-only page to try the show-link helper without a real show.
// Fake the show with ?show=12345, or with the cookie buttons on the page.
export default async function ShowLinkDevTools({ searchParams }: Props) {
  const { show } = await searchParams;

  return (
    <div style={{ maxWidth: 960, margin: '48px auto', padding: '0 16px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Show Link Helper: Test Page</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        bc-catalyst has no shows, so the show code is faked here: from <code>?show=</code> in the URL
        (passed to the hook as a prop), or from a fake <code>project_code</code> cookie.
      </p>
      <ShowLinkTester initialShow={show ?? '12345'} />
    </div>
  );
}
