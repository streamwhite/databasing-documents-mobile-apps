import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PROFILE_PLACEHOLDER = 'User profile & settings — placeholder';

export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PROFILE_PLACEHOLDER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    color: '#666',
  },
});
