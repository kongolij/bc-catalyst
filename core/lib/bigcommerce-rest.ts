const ADMIN_API_HOST = process.env.BIGCOMMERCE_ADMIN_API_HOST ?? 'api.bigcommerce.com';

function buildHeaders(): Record<string, string> {
  const token = process.env.BIGCOMMERCE_ACCESS_TOKEN;

  if (!token) throw new Error('BIGCOMMERCE_ACCESS_TOKEN is not configured');

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Auth-Token': token,
  };
}

function buildUrl(path: string): string {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;

  if (!storeHash) throw new Error('BIGCOMMERCE_STORE_HASH is not configured');

  return `https://${ADMIN_API_HOST}/stores/${storeHash}${path}`;
}

export async function bcRestGet<T>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'GET',
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(`BigCommerce API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function bcRestPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(`BigCommerce API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
