import { API_KEY, API_KEY_HEADER } from './api-config';
import { refreshAccessIfNeeded } from './auth/refreshIfNeeded';

const BEARER_PREFIX = 'Bearer ';

/**
 * Fetch with x-api-key and optional Authorization. Refreshes access token if expired or within 2 min.
 */
export async function authenticatedFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await refreshAccessIfNeeded();
  const headers = new Headers(init?.headers);
  headers.set(API_KEY_HEADER, API_KEY);
  if (token) {
    headers.set('Authorization', BEARER_PREFIX + token);
  }
  return fetch(url, { ...init, headers });
}
