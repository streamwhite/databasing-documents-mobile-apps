import { refreshAccessIfNeeded } from './auth/refreshIfNeeded';
import { authenticatedFetch } from './authenticatedFetch';
import { mobileAuthFetch } from './mobileAuthFetch';

/**
 * Fetch for extract/query: if user is logged in (has valid access token), use authenticatedFetch (user's tenant). Otherwise use mobileAuthFetch (no-login, fixed tenant).
 */
export async function extractQueryFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await refreshAccessIfNeeded();
  if (token) {
    return authenticatedFetch(url, init);
  }
  return mobileAuthFetch(url, init);
}
