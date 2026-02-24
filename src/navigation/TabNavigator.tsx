import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import {
  TAB_BAR_BG,
  TAB_BAR_BORDER,
  TAB_ICON_HOME,
  TAB_ICON_PROFILE,
  TAB_LABEL_HOME,
  TAB_LABEL_PROFILE,
} from '../app-config';

const Tab = createBottomTabNavigator();

function homeTabIcon({ focused, color, size }: { focused: boolean; color: string; size: number }) {
  return <Ionicons name={TAB_ICON_HOME as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
}

function profileTabIcon({ focused, color, size }: { focused: boolean; color: string; size: number }) {
  return <Ionicons name={TAB_ICON_PROFILE as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: TAB_BAR_BG, borderTopColor: TAB_BAR_BORDER },
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: TAB_LABEL_HOME,
          tabBarLabel: TAB_LABEL_HOME,
          tabBarIcon: homeTabIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: TAB_LABEL_PROFILE,
          tabBarLabel: TAB_LABEL_PROFILE,
          tabBarIcon: profileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}
