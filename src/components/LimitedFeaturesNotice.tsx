import React, { useEffect, useRef } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NOTICE_DISMISS_LABEL,
  NOTICE_LIMITED_MESSAGE,
  NOTICE_LIMITED_TITLE,
  NOTICE_TIMEOUT_MS,
  NOTICE_WEB_URL,
} from '../app-config';

export function LimitedFeaturesNotice({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setTimeout(onDismiss, NOTICE_TIMEOUT_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [visible, onDismiss]);

  if (!visible) return null;

  const openUrl = () => Linking.openURL(NOTICE_WEB_URL);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{NOTICE_LIMITED_TITLE}</Text>
          <Text style={styles.message}>{NOTICE_LIMITED_MESSAGE}</Text>
          <Pressable onPress={openUrl} style={styles.urlTouch}>
            <Text style={styles.url}>{NOTICE_WEB_URL}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonLabel}>{NOTICE_DISMISS_LABEL}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  message: { fontSize: 14, color: '#666', marginBottom: 8 },
  urlTouch: { marginBottom: 16 },
  url: { fontSize: 14, color: '#007AFF', textDecorationLine: 'underline' },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonLabel: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
