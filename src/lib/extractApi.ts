import {
  API_BASE_URL,
  EXTRACT_ENDPOINT,
  EXTRACT_PROVIDER,
} from './api-config';
import { extractQueryFetch } from './extractQueryFetch';
import type { PickedFile } from './documentPicker';
import { getErrorFromResponse } from './apiError';
import { setLatestExtractDocumentVersionIds } from './latestExtractVersions';

/** Single result item from POST /documents/extract. */
export interface ExtractResultItem {
  file_name?: string;
  status?: string;
  document_id?: number;
  document_version_id?: number;
  message?: string;
  extracted?: Record<string, unknown>;
}

/** Backend extract response shape. */
export interface ExtractResponse {
  results?: ExtractResultItem[];
}

const EXTRACT_RESPONSE_RESULTS_KEY = 'results';

function getDocumentVersionIdsFromExtractResponse(data: unknown): number[] {
  if (!data || typeof data !== 'object') return [];
  const results = (data as Record<string, unknown>)[EXTRACT_RESPONSE_RESULTS_KEY];
  if (!Array.isArray(results)) return [];
  const ids: number[] = [];
  for (const item of results) {
    if (item && typeof item === 'object' && typeof (item as ExtractResultItem).document_version_id === 'number') {
      ids.push((item as ExtractResultItem).document_version_id!);
    }
  }
  return ids;
}

export type ExtractResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string };

export async function extractDocuments(
  files: PickedFile[],
  documentCategory: string,
  fields: string[],
  provider: string = EXTRACT_PROVIDER,
): Promise<ExtractResult> {
  try {
    const formData = new FormData();
    files.forEach((f, i) => {
      formData.append(
        'files',
        // React Native FormData accepts { uri, name, type } for file upload
        { uri: f.uri, name: f.name ?? `file${i}`, type: f.mimeType ?? 'application/octet-stream' } as unknown as Blob,
      );
    });
    formData.append('document_category', documentCategory);
    formData.append('fields', JSON.stringify(fields));
    formData.append('provider', provider);

    const res = await extractQueryFetch(`${API_BASE_URL}${EXTRACT_ENDPOINT}`, {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      const error = getErrorFromResponse(res.status, text);
      return { ok: false, error };
    }
    const data = await res.json();
    const versionIds = getDocumentVersionIdsFromExtractResponse(data);
    if (versionIds.length > 0) {
      setLatestExtractDocumentVersionIds(versionIds);
    }
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}
