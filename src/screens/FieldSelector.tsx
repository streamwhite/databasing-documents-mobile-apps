import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  BTN_DESELECT_ALL,
  BTN_SELECT_ALL,
  CHECKBOX_CHECKED,
  CHECKBOX_UNCHECKED,
  LABEL_FIELDS_SELECT,
} from '../app-config';
import {
  TEMPLATE_FIELDS_BY_CATEGORY,
  type TemplateFieldItem,
  type TemplateFieldsCategory,
} from '../lib/templateFields';

const NUM_COLUMNS = 3;
const COLUMN_GAP = 8;
/** Approx width per column so NUM_COLUMNS fit in one row with gaps. */
const COLUMN_WIDTH_PCT = 31;

type Props = {
  category: TemplateFieldsCategory;
  selectedEn: Set<string>;
  onToggle: (en: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

function FieldCell({
  item,
  selected,
  onToggle,
}: {
  item: TemplateFieldItem;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      style={[styles.cell, selected && styles.cellSelected]}
      onPress={onToggle}
    >
      <Text style={styles.checkbox}>{selected ? CHECKBOX_CHECKED : CHECKBOX_UNCHECKED}</Text>
      <Text style={styles.cellLabel} numberOfLines={2}>{item.zh}</Text>
    </Pressable>
  );
}

export function FieldSelector({
  category,
  selectedEn,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: Props) {
  const groups = TEMPLATE_FIELDS_BY_CATEGORY[category];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{LABEL_FIELDS_SELECT}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.smallBtn} onPress={onSelectAll}>
          <Text style={styles.smallBtnLabel}>{BTN_SELECT_ALL}</Text>
        </Pressable>
        <Pressable style={styles.smallBtn} onPress={onDeselectAll}>
          <Text style={styles.smallBtnLabel}>{BTN_DESELECT_ALL}</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        {groups.map((g, gi) => (
          <View key={gi} style={styles.group}>
            {g.groupZh ? (
              <Text style={styles.groupTitle}>{g.groupZh}</Text>
            ) : null}
            <View style={styles.grid}>
              {g.fields.map((f) => (
                <View key={f.en} style={[styles.cellWrapper, { width: `${COLUMN_WIDTH_PCT}%` }]}>
                  <FieldCell
                    item={f}
                    selected={selectedEn.has(f.en)}
                    onToggle={() => onToggle(f.en)}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 8, color: '#333' },
  actions: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  smallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  smallBtnLabel: { fontSize: 12, color: '#333' },
  scroll: { maxHeight: 220, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  group: { padding: 8 },
  groupTitle: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COLUMN_GAP,
  },
  cellWrapper: { minWidth: 0 },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
  },
  cellSelected: { backgroundColor: '#e8f4ff', borderColor: '#007AFF' },
  checkbox: { width: 20, fontSize: 14, color: '#007AFF' },
  cellLabel: { flex: 1, fontSize: 13, color: '#333' },
});
