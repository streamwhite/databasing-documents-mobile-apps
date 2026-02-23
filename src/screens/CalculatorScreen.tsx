import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculate, formatResultWithReason } from '../niuniu';
import { FACE_LABELS, HAND_SIZE, MAX_NUM, MIN_NUM } from '../niuniu/constants';

const CARD_OPTIONS: string[] = [
  'A',
  ...Array.from({ length: MAX_NUM - MIN_NUM }, (_, i) => String(i + 2)),
  ...FACE_LABELS,
];

function CardButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardBtn,
        pressed && styles.cardBtnPressed,
        disabled && styles.cardBtnDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.cardBtnText}>{label}</Text>
    </Pressable>
  );
}

function ResultDisplay({ output }: { output: string }) {
  if (!output.trim()) return <View style={styles.resultBox} />;
  const [mainLine, ...reasonLines] = output.split('\n');
  const reasonLine = reasonLines.join('\n');
  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultMain}>{mainLine}</Text>
      {reasonLine ? (
        <Text style={styles.resultReason}>{reasonLine}</Text>
      ) : null}
    </View>
  );
}

export function CalculatorScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [output, setOutput] = useState('');

  const addCard = useCallback((label: string) => {
    setSelected((prev) => {
      if (prev.length >= HAND_SIZE) return prev;
      return [...prev, label];
    });
  }, []);

  useEffect(() => {
    if (selected.length === HAND_SIZE) {
      const result = calculate(selected);
      setOutput(formatResultWithReason(result));
    } else {
      setOutput('');
    }
  }, [selected]);

  const removeLast = useCallback(() => {
    setSelected((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  const reset = useCallback(() => {
    setSelected([]);
    setOutput('');
  }, []);

  const canAdd = selected.length < HAND_SIZE;
  const canRemove = selected.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>牛牛计算器</Text>
      <Text style={styles.hint}>点击输入纸牌值，选满5张自动计算</Text>
      <View style={styles.selectedRow}>
        <Text style={styles.selected}>
          已输入：{selected.length > 0 ? selected.join(' ') : '—'}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.deleteBtn,
            !canRemove && styles.deleteBtnDisabled,
            pressed && styles.deleteBtnPressed,
          ]}
          onPress={removeLast}
          disabled={!canRemove}
          accessibilityLabel='删除最后一个'
        >
          <Ionicons
            name='backspace-outline'
            size={18}
            color={canRemove ? '#fff' : 'rgba(255,255,255,0.6)'}
          />
        </Pressable>
      </View>
      <View style={styles.cardRow}>
        {CARD_OPTIONS.map((label) => (
          <CardButton
            key={label}
            label={label}
            onPress={() => addCard(label)}
            disabled={!canAdd}
          />
        ))}
      </View>
      <ResultDisplay output={output} />
      <Pressable
        style={({ pressed }) => [
          styles.nextBtn,
          pressed && styles.nextBtnPressed,
        ]}
        onPress={reset}
      >
        <Text style={styles.nextBtnText}>另一局</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  hint: { fontSize: 14, color: '#666', marginBottom: 12, textAlign: 'center' },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
    minHeight: 24,
  },
  selected: { fontSize: 16, textAlign: 'center' },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnPressed: { opacity: 0.8 },
  deleteBtnDisabled: { opacity: 0.4 },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  cardBtn: {
    minWidth: 44,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    alignItems: 'center',
  },
  cardBtnPressed: { opacity: 0.7 },
  cardBtnDisabled: { opacity: 0.4 },
  cardBtnText: { fontSize: 16, fontWeight: '500' },
  resultBox: {
    marginBottom: 16,
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  resultMain: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
    textAlign: 'center',
  },
  resultReason: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  nextBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  nextBtnPressed: { opacity: 0.8 },
  nextBtnText: { fontSize: 18, color: '#fff', fontWeight: '500' },
});
