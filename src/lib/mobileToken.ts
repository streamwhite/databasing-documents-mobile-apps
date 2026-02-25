import {
  API_BASE_URL,
  API_KEY,
  API_KEY_HEADER,
  AUTH_MOBILE_TOKEN_ENDPOINT,
  MOBILE_NO_LOGIN_TENANT_ID,
  MOBILE_TOKEN_REFRESH_THRESHOLD_MS,
  MOBILE_TOKEN_TENANT_ID_KEY,
} from './api-config';

const TOKEN_RESPONSE_TOKEN_KEY = 'token';
const TOKEN_RESPONSE_EXPIRES_IN_KEY = 'expiresIn';

type MobileTokenResponse = {
  [TOKEN_RESPONSE_TOKEN_KEY]: string;
  [TOKEN_RESPONSE_EXPIRES_IN_KEY]?: number;
};

let cachedToken: string | null = null;
let cachedExpiresAt = 0;

function isCacheValid(): boolean {
  return (
    cachedToken !== null &&
    Date.now() < cachedExpiresAt - MOBILE_TOKEN_REFRESH_THRESHOLD_MS
  );
}

function setCache(token: string, expiresInSeconds: number): void {
  cachedToken = token;
  cachedExpiresAt = Date.now() + expiresInSeconds * 1000;
}

async function fetchNewToken(): Promise<string> {
  const url = `${API_BASE_URL}${AUTH_MOBILE_TOKEN_ENDPOINT}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      [API_KEY_HEADER]: API_KEY,
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      [MOBILE_TOKEN_TENANT_ID_KEY]: MOBILE_NO_LOGIN_TENANT_ID,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || 'Failed to get mobile token');
  }
  const data = (await res.json()) as MobileTokenResponse;
  const token = data[TOKEN_RESPONSE_TOKEN_KEY];
  if (typeof token !== 'string' || !token) {
    throw new Error('Invalid mobile token response');
  }
  const expiresIn = data[TOKEN_RESPONSE_EXPIRES_IN_KEY];
  const expiresInSeconds = typeof expiresIn === 'number' && expiresIn > 0
    ? expiresIn
    : 300;
  setCache(token, expiresInSeconds);
  return token;
}

/**
 * Returns a signed mobile token for extract/query (no login). Uses cache and refreshes when near expiry.
 */
export async function getMobileToken(): Promise<string> {
  if (isCacheValid() && cachedToken) {
    return cachedToken;
  }
  return fetchNewToken();
}

/**
 * Clear cached mobile token (e.g. on logout or for tests).
 */
export function clearMobileTokenCache(): void {
  cachedToken = null;
  cachedExpiresAt = 0;
}
