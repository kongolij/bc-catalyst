import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

// Header navigation for the "Show Header (Show App)" Makeswift component, read directly from the Show App database
// (Neon): show_navigation holds each show's prebuilt menu (BC tree + the show's products + its category rows:
// display names, hidden categories, CMS links, new tab). Date windows are stored with the items and applied here.
// Same shape as /api/bc/nav-tree: { tree: [{ entityId, name, path, newTab, children }] }.
// Catalyst has no show concept yet: without ?project= the store's first show is used.
// Env: SHOWAPP_DATABASE_URL (the Show App's Neon connection string), BIGCOMMERCE_STORE_HASH.

export const dynamic = 'force-dynamic';

interface StoredNavItem {
  id: number;
  name: string;
  href: string | null;
  newTab: boolean;
  start: string | null;
  end: string | null;
  children: StoredNavItem[];
}

interface TreeNode {
  entityId: number;
  name: string;
  path: string;
  newTab: boolean;
  children: TreeNode[];
}

const inWindow = (item: StoredNavItem, today: string) => (!item.start || today >= item.start) && (!item.end || today <= item.end);

// Outside its date window: hidden, its children move up a level (as the Show App does).
const toTree = (items: StoredNavItem[], today: string): TreeNode[] =>
  items.flatMap((item) => {
    const children = toTree(item.children, today);

    return inWindow(item, today)
      ? [{ entityId: item.id, name: item.name, path: item.href ?? '#', newTab: item.newTab, children }]
      : children;
  });

export async function GET(request: NextRequest) {
  const url = process.env.SHOWAPP_DATABASE_URL;
  const store = process.env.BIGCOMMERCE_STORE_HASH;

  if (!url || !store) {
    return NextResponse.json({ error: 'SHOWAPP_DATABASE_URL and BIGCOMMERCE_STORE_HASH are required', tree: [] }, { status: 500 });
  }

  const project = request.nextUrl.searchParams.get('project')?.trim() || null;

  try {
    const sql = neon(url);
    const [row] = (await sql`
      SELECT n.navigation
      FROM show_instances s
      LEFT JOIN show_navigation n ON n.show_id = s.id
      WHERE s.store_hash = ${store} AND (${project}::text IS NULL OR s.project_number = ${project})
      ORDER BY s.id
      LIMIT 1
    `) as Array<{ navigation: StoredNavItem[] | null }>;
    const today = new Date().toISOString().slice(0, 10);

    return NextResponse.json(
      { tree: toTree(row?.navigation ?? [], today) },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Show DB request failed', tree: [] },
      { status: 502 },
    );
  }
}
