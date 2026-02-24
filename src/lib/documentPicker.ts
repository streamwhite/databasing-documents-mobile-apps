import * as DocumentPicker from 'expo-document-picker';

export type PickedFile = { uri: string; name: string; mimeType?: string };

export type PickDocumentFromDeviceResult =
  | { ok: true; uri: string; name?: string; mimeType?: string }
  | { ok: false; error: 'cancelled' | 'unknown' };

export type PickDocumentsFromDeviceResult =
  | { ok: true; files: PickedFile[] }
  | { ok: false; error: 'cancelled' | 'unknown' };

/** Single file: any type from device (photos, downloads, file manager, etc.). */
export async function pickDocumentFromDevice(): Promise<PickDocumentFromDeviceResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.length) return { ok: false, error: 'cancelled' };
    const a = result.assets[0];
    if (!a.uri) return { ok: false, error: 'unknown' };
    return { ok: true, uri: a.uri, name: a.name, mimeType: a.mimeType };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}

/** Multiple files: any type from device. */
export async function pickDocumentsFromDevice(): Promise<PickDocumentsFromDeviceResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: true,
    });
    if (result.canceled || !result.assets?.length) return { ok: false, error: 'cancelled' };
    const files: PickedFile[] = result.assets
      .filter((a) => a.uri)
      .map((a) => ({ uri: a.uri, name: a.name ?? 'file', mimeType: a.mimeType }));
    if (files.length === 0) return { ok: false, error: 'unknown' };
    return { ok: true, files };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}
