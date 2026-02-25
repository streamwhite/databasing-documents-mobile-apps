import * as SecureStore from 'expo-secure-store';
import type { StoredAuth } from './types';

const KEY_ACCESS = 'auth_access_token';
const KEY_REFRESH = 'auth_refresh_token';
const KEY_TENANT = 'auth_tenant_id';
const KEY_TENANT_NAME = 'auth_tenant_name';
const KEY_USER_NAME = 'auth_user_name';

export async function getStoredAuth(): Promise<StoredAuth | null> {
  try {
    const [access, refresh, tenant, tenantName, userName] = await Promise.all([
      SecureStore.getItemAsync(KEY_ACCESS),
      SecureStore.getItemAsync(KEY_REFRESH),
      SecureStore.getItemAsync(KEY_TENANT),
      SecureStore.getItemAsync(KEY_TENANT_NAME),
      SecureStore.getItemAsync(KEY_USER_NAME),
    ]);
    if (access && refresh && tenant) {
      return {
        access_token: access,
        refresh_token: refresh,
        tenant_id: tenant,
        tenant_name: tenantName ?? '',
        user_name: userName ?? '',
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function setStoredAuth(auth: StoredAuth): Promise<void> {
  try {
    await Promise.all([
      SecureStore.setItemAsync(KEY_ACCESS, auth.access_token),
      SecureStore.setItemAsync(KEY_REFRESH, auth.refresh_token),
      SecureStore.setItemAsync(KEY_TENANT, auth.tenant_id),
      SecureStore.setItemAsync(KEY_TENANT_NAME, auth.tenant_name),
      SecureStore.setItemAsync(KEY_USER_NAME, auth.user_name),
    ]);
  } catch {
    // ignore
  }
}

export async function clearStoredAuth(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(KEY_ACCESS),
      SecureStore.deleteItemAsync(KEY_REFRESH),
      SecureStore.deleteItemAsync(KEY_TENANT),
      SecureStore.deleteItemAsync(KEY_TENANT_NAME),
      SecureStore.deleteItemAsync(KEY_USER_NAME),
    ]);
  } catch {
    // ignore
  }
}
