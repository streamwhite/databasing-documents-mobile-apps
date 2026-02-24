import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AUTH_LABEL_TENANT_PICK,
  AUTH_TENANT_EMPTY,
  AUTH_TENANT_FETCH_FAILED,
  AUTH_TENANT_PICK_PLACEHOLDER,
  AUTH_TENANT_LOADING,
} from '../../app-config';
import type { TenantInfo } from '../../lib/auth/types';

const ICON_CHEVRON_DOWN = '▾';
const ICON_CHEVRON_UP = '▴';

export function TenantPicker({
  tenants,
  selectedTenantId,
  isLoading,
  isDone,
  errorText,
  onSelect,
}: {
  tenants: TenantInfo[];
  selectedTenantId: string | null;
  isLoading: boolean;
  isDone: boolean;
  errorText: string | null;
  onSelect: (t: TenantInfo) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hasTenants = tenants.length > 0;
  const selectedTenant = hasTenants
    ? tenants.find((t) => t.tenant_id === selectedTenantId) ?? null
    : null;

  const toggleOpen = () => {
    if (!hasTenants) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (tenant: TenantInfo) => {
    onSelect(tenant);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{AUTH_LABEL_TENANT_PICK}</Text>
      {isLoading ? (
        <View style={styles.row}>
          <ActivityIndicator />
          <Text style={styles.helper}>{AUTH_TENANT_LOADING}</Text>
        </View>
      ) : null}
      {!isLoading && errorText ? (
        <Text style={styles.helper}>{AUTH_TENANT_FETCH_FAILED}</Text>
      ) : null}
      {!isLoading && isDone && tenants.length === 0 ? (
        <Text style={styles.helper}>{AUTH_TENANT_EMPTY}</Text>
      ) : null}
      {hasTenants ? (
        <View>
          <Pressable style={styles.select} onPress={toggleOpen}>
            <Text
              style={selectedTenant ? styles.selectText : styles.selectPlaceholder}
              numberOfLines={1}
            >
              {selectedTenant?.tenant_name ?? AUTH_TENANT_PICK_PLACEHOLDER}
            </Text>
            <Text style={styles.selectIcon}>
              {isOpen ? ICON_CHEVRON_UP : ICON_CHEVRON_DOWN}
            </Text>
          </Pressable>
          {isOpen ? (
            <View style={styles.options}>
              {tenants.map((t) => {
                const selected = t.tenant_id === selectedTenantId;
                return (
                  <Pressable
                    key={t.tenant_id}
                    style={styles.option}
                    onPress={() => handleSelect(t)}
                  >
                    <Text
                      style={[styles.optionText, selected && styles.optionTextSelected]}
                      numberOfLines={1}
                    >
                      {t.tenant_name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 4, color: '#333' },
  helper: { fontSize: 12, color: '#666' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  select: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { color: '#333', fontSize: 14 },
  selectPlaceholder: { color: '#999', fontSize: 14 },
  selectIcon: { marginLeft: 8, fontSize: 14, color: '#666' },
  options: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: { color: '#333', fontSize: 14 },
  optionTextSelected: { fontWeight: '600', color: '#007AFF' },
});

