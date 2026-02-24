import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ALERT_TITLE_EMPTY,
  AUTH_ALERT_LOGIN_FAILED_TITLE,
  AUTH_ALERT_LOGIN_MISSING_FIELDS,
  AUTH_ALERT_NETWORK_ERROR,
} from '../../app-config';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../lib/auth/authApi';
import type { TenantInfo } from '../../lib/auth/types';
import { useTenantsByEmail } from './useTenantsByEmail';

const EMAIL_AT = '@';

function isLookupEmail(email: string): boolean {
  const v = email.trim();
  return Boolean(v) && v.includes(EMAIL_AT);
}

export function useLoginForm() {
  const { setAuth } = useAuth();
  const nav = useNavigation();
  const { status, tenants, error, lookup } = useTenantsByEmail();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<TenantInfo | null>(null);
  const [manualTenantId, setManualTenantId] = useState('');
  const [loading, setLoading] = useState(false);

  const tenantId = useMemo(
    () => (selectedTenant?.tenant_id ?? manualTenantId).trim(),
    [manualTenantId, selectedTenant?.tenant_id],
  );

  const handleEmailBlur = async () => {
    const isValid = isLookupEmail(email);
    if (isValid) {
      const didLookup = await lookup(email);
      if (didLookup) setSelectedTenant(null);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim() || !tenantId) {
      Alert.alert(ALERT_TITLE_EMPTY, AUTH_ALERT_LOGIN_MISSING_FIELDS);
      return;
    }
    setLoading(true);
    try {
      const result = await login({ email: email.trim(), password, tenant_id: tenantId });
      if (result.ok) {
        await setAuth({
          access_token: result.data.access_token,
          refresh_token: result.data.refresh_token,
          tenant_id: tenantId,
        });
        (nav as { goBack: () => void }).goBack();
      } else {
        Alert.alert(AUTH_ALERT_LOGIN_FAILED_TITLE, result.error);
      }
    } catch {
      Alert.alert(AUTH_ALERT_LOGIN_FAILED_TITLE, AUTH_ALERT_NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const goRegister = () => {
    (nav as { navigate: (name: string) => void }).navigate('Register');
  };

  const onSelectTenant = (t: TenantInfo) => {
    setSelectedTenant(t);
    setManualTenantId('');
  };

  useEffect(() => {
    if (status === 'success' && tenants.length === 1 && !selectedTenant) {
      setSelectedTenant(tenants[0]);
      setManualTenantId('');
    }
  }, [status, tenants, selectedTenant]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    selectedTenant,
    manualTenantId,
    setManualTenantId,
    tenants,
    status,
    error,
    loading,
    handleEmailBlur,
    handleLogin,
    goRegister,
    onSelectTenant,
  };
}

