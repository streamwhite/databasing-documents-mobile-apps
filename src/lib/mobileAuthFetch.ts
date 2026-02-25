import {
  API_KEY,
  API_KEY_HEADER,
  DEVICE_ID_HEADER,
  MOBILE_CLIENT_HEADER,
  MOBILE_CLIENT_VALUE,
  MOBILE_TOKEN_HEADER,
} from './api-config';
import { getOrCreateDeviceId } from './deviceId';
import { getMobileToken } from './mobileToken';

/**
 * Fetch for extract/query without login: sends x-api-key, X-Client: mobile, X-Mobile-Token, and X-Device-Id. Does not send Authorization.
 */
export async function mobileAuthFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const [token, deviceId] = await Promise.all([
    getMobileToken(),
    getOrCreateDeviceId(),
  ]);
  const headers = new Headers(init?.headers);
  headers.set(API_KEY_HEADER, API_KEY);
  headers.set(MOBILE_CLIENT_HEADER, MOBILE_CLIENT_VALUE);
  headers.set(MOBILE_TOKEN_HEADER, token);
  headers.set(DEVICE_ID_HEADER, deviceId);
  return fetch(url, { ...init, headers });
}
