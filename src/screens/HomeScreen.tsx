import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { APP_DISPLAY_NAME } from '../app-config';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_DISPLAY_NAME}</Text>
      <Text style={styles.placeholder}>Home — placeholder</Text>
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: '#666',
  },
});
