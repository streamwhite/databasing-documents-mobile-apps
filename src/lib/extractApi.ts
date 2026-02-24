import {
  API_BASE_URL,
  EXTRACT_ENDPOINT,
  EXTRACT_PROVIDER,
} from './api-config';
import { authenticatedFetch } from './authenticatedFetch';
import type { PickedFile } from './documentPicker';

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

    const res = await authenticatedFetch(`${API_BASE_URL}${EXTRACT_ENDPOINT}`, {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || res.statusText };
    }
    const data = await res.json();
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}
