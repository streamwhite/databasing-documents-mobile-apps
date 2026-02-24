import { REFRESH_THRESHOLD_MS } from '../api-config';
import { getJwtExp, isExpiringWithin } from './jwtExp';
import { refresh } from './authApi';
import { getStoredAuth, setStoredAuth } from './tokenStorage';

/**
 * If stored access token is expired or within REFRESH_THRESHOLD_MS of expiry,
 * call refresh and persist new tokens. Returns current valid access_token (after refresh if needed).
 */
export async function refreshAccessIfNeeded(): Promise<string | null> {
  const auth = await getStoredAuth();
  if (!auth) return null;

  const exp = getJwtExp(auth.access_token);
  if (exp === null) return auth.access_token;

  if (!isExpiringWithin(exp, REFRESH_THRESHOLD_MS)) {
    return auth.access_token;
  }

  const result = await refresh({
    refresh_token: auth.refresh_token,
    tenant_id: auth.tenant_id,
  });

  if (!result.ok) return auth.access_token;

  const next: typeof auth = {
    access_token: result.data.access_token,
    refresh_token: result.data.refresh_token,
    tenant_id: auth.tenant_id,
  };
  await setStoredAuth(next);
  return next.access_token;
}
