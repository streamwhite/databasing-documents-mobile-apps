import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DocumentUploadSection } from './DocumentUploadSection';
import { QuerySection } from './QuerySection';

export function HomeScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <DocumentUploadSection />
      <QuerySection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 32 },
});
