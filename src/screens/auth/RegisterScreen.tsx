import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ALERT_TITLE_EMPTY,
  AUTH_ALERT_NETWORK_ERROR,
  AUTH_ALERT_REGISTER_FAILED_TITLE,
  AUTH_ALERT_REGISTER_MISSING_FIELDS,
  AUTH_ALERT_REGISTER_SUCCESS_PREFIX,
  AUTH_ALERT_REGISTER_SUCCESS_SUFFIX,
  AUTH_BTN_REGISTER,
  AUTH_LABEL_EMAIL,
  AUTH_LABEL_PASSWORD,
  AUTH_LABEL_TENANT_NAME,
  AUTH_LABEL_USER_NAME,
  AUTH_LINK_TO_LOGIN,
  AUTH_PLACEHOLDER_EMAIL,
  AUTH_PLACEHOLDER_PASSWORD,
  AUTH_PLACEHOLDER_TENANT_NAME,
  AUTH_PLACEHOLDER_USER_NAME,
} from '../../app-config';
import { register } from '../../lib/auth/authApi';
import { authStyles } from './authStyles';

function registerSuccessMessage(tenantId: string): string {
  return AUTH_ALERT_REGISTER_SUCCESS_PREFIX + tenantId + AUTH_ALERT_REGISTER_SUCCESS_SUFFIX;
}

export function RegisterScreen() {
  const nav = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !tenantName.trim() || !userName.trim()) {
      Alert.alert(ALERT_TITLE_EMPTY, AUTH_ALERT_REGISTER_MISSING_FIELDS);
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        email: email.trim(),
        password,
        tenant_name: tenantName.trim(),
        user_name: userName.trim(),
      });
      if (result.ok) {
        Alert.alert(ALERT_TITLE_EMPTY, registerSuccessMessage(result.data.tenant_id));
        (nav as { goBack: () => void }).goBack();
      } else {
        Alert.alert(AUTH_ALERT_REGISTER_FAILED_TITLE, result.error);
      }
    } catch {
      Alert.alert(AUTH_ALERT_REGISTER_FAILED_TITLE, AUTH_ALERT_NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const goLogin = () => {
    (nav as { navigate: (name: string) => void }).navigate('Login');
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.label}>{AUTH_LABEL_EMAIL}</Text>
      <TextInput
        style={authStyles.input}
        value={email}
        onChangeText={setEmail}
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
      <Text style={authStyles.label}>{AUTH_LABEL_TENANT_NAME}</Text>
      <TextInput
        style={authStyles.input}
        value={tenantName}
        onChangeText={setTenantName}
        placeholder={AUTH_PLACEHOLDER_TENANT_NAME}
      />
      <Text style={authStyles.label}>{AUTH_LABEL_USER_NAME}</Text>
      <TextInput
        style={authStyles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder={AUTH_PLACEHOLDER_USER_NAME}
      />
      <TouchableOpacity
        style={[authStyles.button, loading && authStyles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={authStyles.buttonText}>{AUTH_BTN_REGISTER}</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={authStyles.link} onPress={goLogin}>
        <Text style={authStyles.linkText}>{AUTH_LINK_TO_LOGIN}</Text>
      </TouchableOpacity>
    </View>
  );
}

