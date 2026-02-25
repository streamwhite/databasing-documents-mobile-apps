import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Toast from 'react-native-toast-message';
import {
  BTN_SEND_QUERY,
  LABEL_QUERY_INPUT,
  LABEL_SECTION_QUERY,
  MSG_DEVICE_DAILY_LIMIT,
  MSG_QUERY_ERROR,
  MSG_QUERY_LOADING,
  MSG_QUERY_OK,
  MSG_USAGE_QUERY_LIMIT,
  PLACEHOLDER_QUERY,
  TAB_BAR_BG,
  USAGE_DAILY_LIMIT,
} from '../app-config';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_QUERY } from '../lib/api-config';
import { getFirstRowRawTextMarkdown, queryDocuments } from '../lib/queryApi';
import { getTodayUsage, incrementUsage, isOverLimit } from '../lib/usageLimits';

export function QuerySection() {
  const { auth } = useAuth();
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [result, setResult] = useState<null | 'ok' | 'fail'>(null);
  const [rawMarkdown, setRawMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (isLoading) return;
    setResult(null);
    setRawMarkdown(null);
    const usage = await getTodayUsage();
    if (isOverLimit('query', usage, USAGE_DAILY_LIMIT)) {
      const msg = auth ? MSG_USAGE_QUERY_LIMIT : MSG_DEVICE_DAILY_LIMIT;
      Toast.show({ type: 'error', text1: msg });
      return;
    }
    setIsLoading(true);
    try {
      const res = await queryDocuments(query);
      if (res.ok) {
        setResult('ok');
        setRawMarkdown(getFirstRowRawTextMarkdown(res.data));
        Toast.show({ type: 'success', text1: MSG_QUERY_OK });
        await incrementUsage('query');
      } else {
        setResult('fail');
        Toast.show({
          type: 'error',
          text1: MSG_QUERY_ERROR,
          text2: res.error,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{LABEL_SECTION_QUERY}</Text>
      <Text style={styles.inputLabel}>{LABEL_QUERY_INPUT}</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder={PLACEHOLDER_QUERY}
        placeholderTextColor="#999"
      />
      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSend}
        disabled={isLoading}
      >
        <Text style={styles.buttonLabel}>
          {isLoading ? MSG_QUERY_LOADING : BTN_SEND_QUERY}
        </Text>
      </Pressable>
      {rawMarkdown !== null && rawMarkdown !== '' && (
        <ScrollView style={styles.markdownScroll} nestedScrollEnabled>
          <View style={styles.markdownBlock}>
            <Markdown style={markdownStyles}>{rawMarkdown}</Markdown>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const markdownStyles = StyleSheet.create({
  body: { fontSize: 14, color: '#333' },
  paragraph: { marginTop: 6, marginBottom: 6 },
  heading1: { fontSize: 20, fontWeight: '700', marginTop: 8, marginBottom: 4 },
  heading2: { fontSize: 18, fontWeight: '600', marginTop: 6, marginBottom: 4 },
  code_inline: { fontFamily: 'monospace', backgroundColor: '#eee', paddingHorizontal: 4 },
  code_block: { fontFamily: 'monospace', backgroundColor: TAB_BAR_BG, padding: 8, borderRadius: 4 },
});

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 44,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonLabel: { fontSize: 16, color: '#fff', fontWeight: '600', textAlign: 'center' },
  markdownScroll: { maxHeight: 400, marginTop: 12 },
  markdownBlock: {
    padding: 12,
    backgroundColor: TAB_BAR_BG,
    borderRadius: 8,
  },
});
