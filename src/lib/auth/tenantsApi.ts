import {
  API_BASE_URL,
  API_KEY,
  API_KEY_HEADER,
  TENANTS_BY_EMAIL_ENDPOINT,
} from '../api-config';
import type { TenantsByEmailResponse } from './types';

const ACCEPT_JSON: Record<string, string> = {
  accept: 'application/json',
  [API_KEY_HEADER]: API_KEY,
};
const QUERY_KEY_EMAIL = 'email';

function tenantsByEmailUrl(email: string): string {
  const url = new URL(`${API_BASE_URL}${TENANTS_BY_EMAIL_ENDPOINT}`);
  url.searchParams.set(QUERY_KEY_EMAIL, email);
  return url.toString();
}

const METHOD_GET = 'GET';

export async function getTenantsByEmail(
  email: string,
  signal?: AbortSignal,
): Promise<
  | { ok: true; data: TenantsByEmailResponse }
  | { ok: false; error: string; requestUrl: string }
> {
  const requestUrl = tenantsByEmailUrl(email);
  try {
    const res = await fetch(requestUrl, {
      method: METHOD_GET,
      headers: ACCEPT_JSON,
      signal,
    });
    const data = (await res.json()) as unknown;
    if (!res.ok) {
      const detail = (data as { detail?: string } | null)?.detail;
      return { ok: false, error: detail ?? res.statusText, requestUrl };
    }
    return { ok: true, data: data as TenantsByEmailResponse };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const errorName = e instanceof Error ? e.name : 'unknown';
    return { ok: false, error: `${errorName}: ${msg}`, requestUrl };
  }
}

