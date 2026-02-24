import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  AUTH_BTN_LOGIN,
  AUTH_LABEL_EMAIL,
  AUTH_LABEL_PASSWORD,
  AUTH_LABEL_TENANT_ID,
  AUTH_LINK_TO_REGISTER,
  AUTH_PLACEHOLDER_EMAIL,
  AUTH_PLACEHOLDER_PASSWORD,
  AUTH_PLACEHOLDER_TENANT_ID,
} from '../../app-config';
import { authStyles } from './authStyles';
import { TenantPicker } from './TenantPicker';
import { useLoginForm } from './useLoginForm';

export function LoginScreen() {
  const {
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
  } = useLoginForm();

  const showTenantPicker = tenants.length > 0;
  const showManualTenantId = !showTenantPicker;
  const isLookupLoading = status === 'loading';
  const isLookupDone = status === 'success';

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.label}>{AUTH_LABEL_EMAIL}</Text>
      <TextInput
        style={authStyles.input}
        value={email}
        onChangeText={setEmail}
        onBlur={handleEmailBlur}
        placeholder={AUTH_PLACEHOLDER_EMAIL}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={authStyles.label}>{AUTH_LABEL_PASSWORD}</Text>
      <TextInput
        style={authStyles.input}
        value={password}
        onChangeText={setPassword}
        placeholder={AUTH_PLACEHOLDER_PASSWORD}
        secureTextEntry
      />

      <TenantPicker
        tenants={tenants}
        selectedTenantId={selectedTenant?.tenant_id ?? null}
        isLoading={isLookupLoading}
        isDone={isLookupDone}
        errorText={error}
        onSelect={onSelectTenant}
      />

      {showManualTenantId ? (
        <>
          <Text style={authStyles.label}>{AUTH_LABEL_TENANT_ID}</Text>
          <TextInput
            style={authStyles.input}
            value={manualTenantId}
            onChangeText={setManualTenantId}
            placeholder={AUTH_PLACEHOLDER_TENANT_ID}
            autoCapitalize="none"
          />
        </>
      ) : null}

      <TouchableOpacity
        style={[authStyles.button, loading && authStyles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={authStyles.buttonText}>{AUTH_BTN_LOGIN}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={authStyles.link} onPress={goRegister}>
        <Text style={authStyles.linkText}>{AUTH_LINK_TO_REGISTER}</Text>
      </TouchableOpacity>
    </View>
  );
}

