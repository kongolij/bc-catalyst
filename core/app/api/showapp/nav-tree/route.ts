import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';

// Header navigation for the "Show Header (Show App)" Makeswift component. Two sources, merged here:
//  1. The Show App database (Neon): show_navigation holds each show's prebuilt menu: its structure and the show's
//     own decisions (display names, CMS links, new tab, date windows). It holds no BigCommerce names or paths.
//  2. BigCommerce (Storefront GraphQL categoryTree, the categories shown on this channel): each category's current
//     name and URL path.
// name = the show's display name, else the BigCommerce name; path = the category's BigCommerce path, unless the item
// has its own link (CMS url, content page). So a rename in BigCommerce shows without a Show App rebuild, and a
// category hidden or deleted in BigCommerce since the last build is left out with its branch.
// If BigCommerce can't be read, the request fails (502), as it does when the Show App DB can't be read.
// Menus stored before the Show App stopped storing names still carry name / href on every item; those are used as
// stored until the next rebuild.
// Same shape as /api/bc/nav-tree: { tree: [{ entityId, name, path, newTab, children }] }.
// Catalyst has no show concept yet: without ?project= the store's first show is used.
// Env: SHOWAPP_DATABASE_URL (the Show App's Neon connection string), BIGCOMMERCE_STORE_HASH.

export const dynamic = 'force-dynamic';

interface StoredNavItem {
  id: number;
  /** Custom categories (and menus built before names were dropped): the item's own name. */
  name?: string;
  /** A BigCommerce category's override, when the show set one. */
  displayName?: string;
  /** Only when the link is not the BigCommerce category page (CMS url, possibly null, or a content page). */
  href?: string | null;
  newTab: boolean;
  start?: string | null;
  end?: string | null;
  children: StoredNavItem[];
}

interface TreeNode {
  entityId: number;
  name: string;
  path: string;
  newTab: boolean;
  children: TreeNode[];
}

type Labels = Map<number, { name: string; path: string | null }>;

// Four levels: one more than the storefront header asks for, so a show menu one level deeper still finds its names.
const ShowNavLabelsQuery = graphql(`
  query ShowNavLabels {
    site {
      categoryTree {
        entityId
        name
        path
        children {
          entityId
          name
          path
          children {
            entityId
            name
            path
            children {
              entityId
              name
              path
            }
          }
        }
      }
    }
  }
`);

interface LabelNode {
  entityId: number;
  name: string;
  path: string;
  children?: LabelNode[];
}

// Same freshness as the Show App's own BigCommerce reads (5 minutes): a BigCommerce rename shows within that time.
const LABELS_REVALIDATE_SECONDS = 300;

async function liveLabels(): Promise<Labels> {
  const result = await client.fetch({
    document: ShowNavLabelsQuery,
    fetchOptions: { next: { revalidate: LABELS_REVALIDATE_SECONDS } },
  });
  const labels: Labels = new Map();
  const walk = (nodes: LabelNode[] | undefined) =>
    nodes?.forEach((node) => {
      labels.set(node.entityId, { name: node.name, path: node.path });
      walk(node.children);
    });

  walk(result.data.site.categoryTree as LabelNode[]);

  return labels;
}

const inWindow = (item: StoredNavItem, today: string) => (!item.start || today >= item.start) && (!item.end || today <= item.end);

// Outside its date window: hidden with its branch (as the Show App does). Items without dates have no start/end.
// A BigCommerce category missing from this channel's tree is hidden with its branch. Custom categories (negative ids)
// are not in BigCommerce and keep their own name and link.
const toTree = (items: StoredNavItem[], today: string, labels: Labels): TreeNode[] =>
  items.flatMap((item) => {
    if (!inWindow(item, today)) return [];

    const bc = item.id > 0 ? labels.get(item.id) : undefined;

    if (item.id > 0 && !bc) return [];

    return [
      {
        entityId: item.id,
        name: item.name ?? item.displayName ?? bc?.name ?? `Category ${item.id}`,
        path: (item.href !== undefined ? item.href : bc?.path) ?? '#',
        newTab: item.newTab,
        children: toTree(item.children, today, labels),
      },
    ];
  });

interface ShowNavRow {
  navigation: StoredNavItem[] | null;
}

export async function GET(request: NextRequest) {
  const url = process.env.SHOWAPP_DATABASE_URL;
  const store = process.env.BIGCOMMERCE_STORE_HASH;

  if (!url || !store) {
    return NextResponse.json({ error: 'SHOWAPP_DATABASE_URL and BIGCOMMERCE_STORE_HASH are required', tree: [] }, { status: 500 });
  }

  const project = request.nextUrl.searchParams.get('project')?.trim() || null;

  try {
    const sql = neon(url);
    const [rows, labels] = await Promise.all([
      sql`
        SELECT n.navigation
        FROM show_instances s
        LEFT JOIN show_navigation n ON n.show_id = s.id
        WHERE s.store_hash = ${store} AND (${project}::text IS NULL OR s.project_number = ${project})
        ORDER BY s.id
        LIMIT 1
      `,
      liveLabels(),
    ]);
    const row = (rows as ShowNavRow[])[0];
    const today = new Date().toISOString().slice(0, 10);

    return NextResponse.json(
      { tree: toTree(row?.navigation ?? [], today, labels) },
      // Not cached: a Show App change (switch, rename, new category) shows on the next load. One indexed query plus
      // the BigCommerce tree (cached LABELS_REVALIDATE_SECONDS).
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Show DB or BigCommerce request failed', tree: [] },
      { status: 502 },
    );
  }
}
