const BASE = 'https://api.contentful.com';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function cfg() {
  return {
    spaceId: requireEnv('CONTENTFUL_SPACE_ID'),
    envId: process.env.CONTENTFUL_ENVIRONMENT_ID ?? 'master',
    token: requireEnv('CONTENTFUL_CMA_TOKEN'),
    locale: process.env.CONTENTFUL_DEFAULT_LOCALE ?? 'en-US',
  };
}

function envBase() {
  const { spaceId, envId } = cfg();
  return `${BASE}/spaces/${spaceId}/environments/${envId}`;
}

function authHeaders(extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${cfg().token}`,
    'Content-Type': 'application/vnd.contentful.management.v1+json',
    ...extra,
  };
}

export interface ContentTypeField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  localized: boolean;
  linkType?: string;
  items?: { type: string; linkType?: string };
}

export interface ContentType {
  id: string;
  name: string;
  displayField: string | null;
  description: string | null;
  fields: ContentTypeField[];
}

export async function listContentTypes(): Promise<ContentType[]> {
  const res = await fetch(`${envBase()}/content_types?limit=100`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`CMA listContentTypes ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.items ?? []).map((item: any) => ({
    id: item.sys.id,
    name: item.name,
    displayField: item.displayField ?? null,
    description: item.description ?? null,
    fields: (item.fields ?? []).map((f: any) => ({
      id: f.id,
      name: f.name,
      type: f.type,
      required: !!f.required,
      localized: !!f.localized,
      linkType: f.linkType,
      items: f.items,
    })),
  }));
}

export async function getContentType(contentTypeId: string): Promise<ContentType> {
  const res = await fetch(`${envBase()}/content_types/${contentTypeId}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`CMA getContentType ${res.status}: ${await res.text()}`);
  const item = await res.json();
  return {
    id: item.sys.id,
    name: item.name,
    displayField: item.displayField ?? null,
    description: item.description ?? null,
    fields: (item.fields ?? []).map((f: any) => ({
      id: f.id,
      name: f.name,
      type: f.type,
      required: !!f.required,
      localized: !!f.localized,
      linkType: f.linkType,
      items: f.items,
    })),
  };
}

export interface CreateEntryInput {
  contentTypeId: string;
  fields: Record<string, unknown>;
}

export interface CreatedEntry {
  id: string;
  contentTypeId: string;
  version: number;
  webUrl: string;
}

export async function createEntry(input: CreateEntryInput): Promise<CreatedEntry> {
  const { locale, spaceId, envId } = cfg();
  const localizedFields = Object.fromEntries(
    Object.entries(input.fields).map(([k, v]) => [k, { [locale]: v }]),
  );

  const res = await fetch(`${envBase()}/entries`, {
    method: 'POST',
    headers: authHeaders({ 'X-Contentful-Content-Type': input.contentTypeId }),
    body: JSON.stringify({ fields: localizedFields }),
  });
  if (!res.ok) throw new Error(`CMA createEntry ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return {
    id: data.sys.id,
    contentTypeId: input.contentTypeId,
    version: data.sys.version,
    webUrl: `https://app.contentful.com/spaces/${spaceId}/environments/${envId}/entries/${data.sys.id}`,
  };
}
