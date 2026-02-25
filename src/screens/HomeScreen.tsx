import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { NOTICE_NO_LOGIN_7DAY } from '../app-config';
import { DocumentUploadSection } from './DocumentUploadSection';
import { QuerySection } from './QuerySection';

export function HomeScreen() {
  const { auth } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews
        nestedScrollEnabled
      >
        {!auth && (
          <View style={styles.noLoginNotice}>
            <Text style={styles.noLoginNoticeText}>{NOTICE_NO_LOGIN_7DAY}</Text>
          </View>
        )}
        <DocumentUploadSection />
        <QuerySection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 32 },
  noLoginNotice: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  noLoginNoticeText: { fontSize: 13, color: '#856404' },
});
