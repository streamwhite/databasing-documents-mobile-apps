import { API_BASE_URL, QUERY_ENDPOINT } from './api-config';
import { authenticatedFetch } from './authenticatedFetch';

/** Backend POST /query response shape */
export interface QueryResponse {
  sql?: string;
  rows?: unknown[];
  row_count?: number;
}

export type QueryResult =
  | { ok: true; data: QueryResponse }
  | { ok: false; error: string };

export async function queryDocuments(query: string): Promise<QueryResult> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}${QUERY_ENDPOINT}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || res.statusText };
    }
    const data = (await res.json()) as QueryResponse;
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}
