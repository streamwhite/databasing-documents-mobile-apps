import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  BTN_SEND_QUERY,
  LABEL_QUERY_SQL,
  MSG_QUERY_ERROR,
  MSG_QUERY_LOADING,
  MSG_QUERY_OK,
  PLACEHOLDER_QUERY,
  TAB_BAR_BG,
} from '../app-config';
import { DEFAULT_QUERY } from '../lib/api-config';
import { queryDocuments } from '../lib/queryApi';

export function QuerySection() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [result, setResult] = useState<null | 'ok' | 'fail'>(null);
  const [returnedSql, setReturnedSql] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (isLoading) return;
    setResult(null);
    setReturnedSql(null);
    setIsLoading(true);
    try {
      const res = await queryDocuments(query);
      if (res.ok) {
        setResult('ok');
        setReturnedSql(res.data.sql ?? null);
        Toast.show({ type: 'success', text1: MSG_QUERY_OK });
      } else {
        setResult('fail');
        Toast.show({ type: 'error', text1: MSG_QUERY_ERROR });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.section}>
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
      {returnedSql !== null && (
        <View style={styles.sqlBlock}>
          <Text style={styles.sqlLabel}>{LABEL_QUERY_SQL}</Text>
          <Text style={styles.sqlText} selectable>
            {returnedSql}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
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
  },
  buttonDisabled: { opacity: 0.6 },
  buttonLabel: { fontSize: 16, color: '#fff', fontWeight: '600' },
  sqlBlock: { marginTop: 12, padding: 12, backgroundColor: TAB_BAR_BG, borderRadius: 8 },
  sqlLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  sqlText: { fontSize: 13, fontFamily: 'monospace', color: '#333' },
});
