/**
 * Decode JWT payload (middle segment) and return exp (seconds since epoch), or null.
 */
export function getJwtExp(accessToken: string): number | null {
  try {
    const parts = accessToken.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const obj = JSON.parse(decoded) as { exp?: number };
    return typeof obj.exp === 'number' ? obj.exp : null;
  } catch {
    return null;
  }
}

/** True if token expires within thresholdMs from now. */
export function isExpiringWithin(expSeconds: number, thresholdMs: number): boolean {
  const expMs = expSeconds * 1000;
  return expMs - Date.now() < thresholdMs;
}
