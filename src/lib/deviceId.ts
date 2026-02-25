import * as SecureStore from 'expo-secure-store';

const DEVICE_ID_STORAGE_KEY = 'device_id_v1';

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return fallbackUuidV4();
}

function fallbackUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function isValidUuid(value: string): boolean {
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof value === 'string' && value.length > 0 && uuidRe.test(value);
}

/**
 * Returns a stable device id (UUID). Reads from SecureStore; if missing, generates one and stores it.
 */
export async function getOrCreateDeviceId(): Promise<string> {
  try {
    const existing = await SecureStore.getItemAsync(DEVICE_ID_STORAGE_KEY);
    if (existing && isValidUuid(existing)) {
      return existing;
    }
  } catch {
    // continue to generate new
  }
  const id = generateUuid();
  try {
    await SecureStore.setItemAsync(DEVICE_ID_STORAGE_KEY, id);
  } catch {
    // still return id for this session
  }
  return id;
}
