import { API_BASE_URL, QUERY_ENDPOINT } from './api-config';
import { getErrorFromResponse } from './apiError';
import { refreshAccessIfNeeded } from './auth/refreshIfNeeded';
import { extractQueryFetch } from './extractQueryFetch';
import { getLatestExtractDocumentVersionIds } from './latestExtractVersions';

/** Suffix appended to query string for no-login scoping; backend parses and filters by these ids. */
const QUERY_SUFFIX_DOCUMENT_VERSION_IDS = ',并且[document_version_ids:';

const RAW_TEXT_KEY = 'raw_text';

/** One part of multipart raw_text (e.g. { type: 'text', text: '...' }). */
type RawTextPart = { type?: string; text?: string };

/** Backend POST /query response shape */
export interface QueryResponse {
  sql?: string;
  rows?: Record<string, unknown>[];
  row_count?: number;
}

/** Normalize raw_text (string or multipart array) from first row to a single markdown string. */
export function getFirstRowRawTextMarkdown(data: QueryResponse): string | null {
  const rows = data.rows;
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const first = rows[0];
  if (!first || typeof first !== 'object') return null;
  const raw = first[RAW_TEXT_KEY];
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) {
    const parts = raw as RawTextPart[];
    const text = parts
      .map((p) => (typeof p?.text === 'string' ? p.text : ''))
      .join('');
    return text || null;
  }
  return null;
}

export type QueryResult =
  | { ok: true; data: QueryResponse }
  | { ok: false; error: string };

function appendDocumentVersionIds(query: string, ids: number[]): string {
  if (ids.length === 0) return query;
  return query + QUERY_SUFFIX_DOCUMENT_VERSION_IDS + ids.join(',') + ']';
}

export async function queryDocuments(query: string): Promise<QueryResult> {
  try {
    const token = await refreshAccessIfNeeded();
    const ids = token ? [] : getLatestExtractDocumentVersionIds();
    const queryStr = appendDocumentVersionIds(query, ids);
    const res = await extractQueryFetch(`${API_BASE_URL}${QUERY_ENDPOINT}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: queryStr }),
    });

    if (!res.ok) {
      const text = await res.text();
      const error = getErrorFromResponse(res.status, text);
      return { ok: false, error };
    }
    const data = (await res.json()) as QueryResponse;
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}
