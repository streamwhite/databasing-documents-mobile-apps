import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AUTH_BTN_LOGIN,
  AUTH_BTN_LOGOUT,
  AUTH_BTN_REGISTER,
} from '../app-config';
import { useAuth } from '../context/AuthContext';
import type { ProfileStackParamList } from '../navigation/ProfileStack';

type NavProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

export function ProfileScreen() {
  const { auth, isLoading, clearAuth } = useAuth();
  const nav = useNavigation<NavProp>();

  const handleLogout = () => {
    Alert.alert('', AUTH_BTN_LOGOUT, [
      { text: '取消', style: 'cancel' },
      {
        text: AUTH_BTN_LOGOUT,
        style: 'destructive',
        onPress: () => clearAuth(),
      },
    ]);
  };

  const goLogin = () => nav.navigate('Login');
  const goRegister = () => nav.navigate('Register');

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!auth) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={goLogin}>
          <Text style={styles.buttonText}>{AUTH_BTN_LOGIN}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={goRegister}>
          <Text style={styles.buttonSecondaryText}>{AUTH_BTN_REGISTER}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>组织或企业 ID</Text>
      <Text style={styles.value}>{auth.tenant_id}</Text>
      <TouchableOpacity style={styles.buttonOutlined} onPress={handleLogout}>
        <Text style={styles.buttonOutlinedText}>{AUTH_BTN_LOGOUT}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, color: '#333', marginBottom: 24 },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonOutlined: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonSecondaryText: { color: '#007AFF', fontSize: 16 },
  buttonOutlinedText: { color: '#666', fontSize: 16 },
});
