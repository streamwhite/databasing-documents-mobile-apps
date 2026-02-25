import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { AUTH_BTN_LOGIN, AUTH_BTN_REGISTER } from '../app-config';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: AUTH_BTN_LOGIN }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: AUTH_BTN_REGISTER }}
      />
    </Stack.Navigator>
  );
}
