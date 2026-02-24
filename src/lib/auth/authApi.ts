import {
  API_BASE_URL,
  API_KEY,
  API_KEY_HEADER,
  AUTH_LOGIN_ENDPOINT,
  AUTH_REFRESH_ENDPOINT,
  AUTH_REGISTER_ENDPOINT,
} from '../api-config';
import type {
  LoginParams,
  RefreshParams,
  RegisterParams,
  RegisterResponse,
  TokenResponse,
} from './types';

const JSON_HEADERS: Record<string, string> = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  [API_KEY_HEADER]: API_KEY,
};

export async function register(
  params: RegisterParams,
): Promise<{ ok: true; data: RegisterResponse } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${AUTH_REGISTER_ENDPOINT}`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: (data as { detail?: string }).detail ?? res.statusText };
    }
    return { ok: true, data: data as RegisterResponse };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

export async function login(
  params: LoginParams,
): Promise<{ ok: true; data: TokenResponse } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${AUTH_LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: (data as { detail?: string }).detail ?? res.statusText };
    }
    return { ok: true, data: data as TokenResponse };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

export async function refresh(
  params: RefreshParams,
): Promise<{ ok: true; data: TokenResponse } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${AUTH_REFRESH_ENDPOINT}`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: (data as { detail?: string }).detail ?? res.statusText };
    }
    return { ok: true, data: data as TokenResponse };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}
