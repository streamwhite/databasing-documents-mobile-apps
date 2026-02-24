import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { StoredAuth } from '../lib/auth/types';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '../lib/auth/tokenStorage';

interface AuthContextValue {
  auth: StoredAuth | null;
  isLoading: boolean;
  setAuth: (auth: StoredAuth) => Promise<void>;
  clearAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuthState] = useState<StoredAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getStoredAuth().then((stored) => {
      if (!cancelled) {
        setAuthState(stored);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setAuth = useCallback(async (next: StoredAuth) => {
    await setStoredAuth(next);
    setAuthState(next);
  }, []);

  const clearAuth = useCallback(async () => {
    await clearStoredAuth();
    setAuthState(null);
  }, []);

  const value: AuthContextValue = { auth, isLoading, setAuth, clearAuth };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
