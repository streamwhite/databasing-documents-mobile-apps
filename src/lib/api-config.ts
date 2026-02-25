const DEFAULT_API_BASE_URL = 'http://localhost:4020';
const ENV_API_BASE_URL_KEY = 'EXPO_PUBLIC_API_BASE_URL';
const ENV_API_KEY_KEY = 'EXPO_PUBLIC_API_KEY';
const ENV_MOBILE_TENANT_ID_KEY = 'EXPO_PUBLIC_MOBILE_TENANT_ID';
const DEFAULT_API_KEY = 'd2623508-114a-4518-9051-74828889a130';

/** Tenant for no-login extract/query (mobile testing). Override via EXPO_PUBLIC_MOBILE_TENANT_ID. */
export const MOBILE_NO_LOGIN_TENANT_ID =
  (typeof process !== 'undefined' && process.env?.[ENV_MOBILE_TENANT_ID_KEY]) ||
  'Nwa2YSWRutdnkYDhs4nz8H';

/** Request body key for tenant_id when calling POST /auth/mobile-token. */
export const MOBILE_TOKEN_TENANT_ID_KEY = 'tenant_id';

/** 0.0.0.0 is not valid for outbound requests in React Native; use localhost. */
const HOST_0 = '0.0.0.0';
const HOST_LOCALHOST = 'localhost';

function normalizeApiBaseUrl(url: string): string {
  if (url.includes(HOST_0)) {
    return url.replace(HOST_0, HOST_LOCALHOST);
  }
  return url;
}

/** Backend base URL: set EXPO_PUBLIC_API_BASE_URL in .env for production. 0.0.0.0 is normalized to localhost. */
export const API_BASE_URL = normalizeApiBaseUrl(
  (typeof process !== 'undefined' && process.env?.[ENV_API_BASE_URL_KEY]) ||
    DEFAULT_API_BASE_URL,
);

/** x-api-key for all backend requests; set EXPO_PUBLIC_API_KEY in .env for production. */
export const API_KEY =
  (typeof process !== 'undefined' && process.env?.[ENV_API_KEY_KEY]) ||
  DEFAULT_API_KEY;
export const API_KEY_HEADER = 'x-api-key';

export const EXTRACT_ENDPOINT = '/documents/extract';
export const QUERY_ENDPOINT = '/query';
export const AUTH_REGISTER_ENDPOINT = '/auth/register';
export const AUTH_LOGIN_ENDPOINT = '/auth/login';
export const AUTH_REFRESH_ENDPOINT = '/auth/refresh';
export const AUTH_MOBILE_TOKEN_ENDPOINT = '/auth/mobile-token';
export const TENANTS_BY_EMAIL_ENDPOINT = '/tenants/by-email';

/** Mobile no-login auth: header names and value for extract/query. */
export const MOBILE_CLIENT_HEADER = 'X-Client';
export const MOBILE_CLIENT_VALUE = 'mobile';
export const MOBILE_TOKEN_HEADER = 'X-Mobile-Token';

/** Device id for backend per-device rate/usage counting (extract/query). */
export const DEVICE_ID_HEADER = 'X-Device-Id';
export const EXTRACT_PROVIDER = 'gemini-3-flash-preview';

export const DEFAULT_QUERY = '本科专业为工商管理的简历';

/** Token refresh when access token expires within this many ms. */
export const REFRESH_THRESHOLD_MS = 2 * 60 * 1000;

/** Refresh mobile token when it expires within this many ms. */
export const MOBILE_TOKEN_REFRESH_THRESHOLD_MS = 60 * 1000;
