import { useCallback, useRef, useState } from 'react';
import { getTenantsByEmail } from '../../lib/auth/tenantsApi';
import type { TenantInfo } from '../../lib/auth/types';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useTenantsByEmail() {
  const [status, setStatus] = useState<Status>('idle');
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [requestUrl, setRequestUrl] = useState<string | null>(null);
  const lastEmailRef = useRef<string>('');
  const abortRef = useRef<AbortController | null>(null);
  const reqIdRef = useRef(0);

  const lookup = useCallback(async (email: string): Promise<boolean> => {
    const normalized = email.trim();
    if (!normalized || normalized === lastEmailRef.current) {
      return false;
    }

    lastEmailRef.current = normalized;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const reqId = ++reqIdRef.current;

    setStatus('loading');
    setError(null);
    setRequestUrl(null);
    const result = await getTenantsByEmail(normalized, controller.signal);
    if (reqId !== reqIdRef.current) {
      return false;
    }

    if (result.ok) {
      setTenants(result.data.tenants ?? []);
      setStatus('success');
      return true;
    } else {
      setTenants([]);
      setError(result.error);
      setRequestUrl(result.requestUrl);
      setStatus('error');
      return true;
    }
  }, []);

  return { status, tenants, error, requestUrl, lookup };
}

