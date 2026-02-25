import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  BTN_EXTRACT,
  BTN_UPLOAD_DOCUMENT,
  LABEL_CATEGORY,
  LABEL_EXTRACT_FILES,
  LABEL_SECTION_EXTRACT,
  MSG_CAMERA_CANCELLED,
  MSG_CAMERA_ERROR,
  MSG_CAMERA_PERMISSION_DENIED,
  MSG_EXTRACT_ERROR,
  MSG_EXTRACT_LOADING,
  MSG_DEVICE_DAILY_LIMIT,
  MSG_EXTRACT_NO_FIELDS,
  MSG_EXTRACT_OK,
  MSG_USAGE_EXTRACT_LIMIT,
  UPLOAD_CHOICE_TITLE,
  UPLOAD_CHOICE_MULTIPLE_HINT,
  UPLOAD_OPTION_CAMERA,
  UPLOAD_OPTION_CANCEL,
  UPLOAD_OPTION_GALLERY,
  USAGE_DAILY_LIMIT,
} from '../app-config';
import { useAuth } from '../context/AuthContext';
import { takeDocumentPhoto } from '../lib/camera';
import type { PickedFile } from '../lib/documentPicker';
import { pickDocumentsFromDevice } from '../lib/documentPicker';
import { extractDocuments } from '../lib/extractApi';
import { getTodayUsage, incrementUsage, isOverLimit } from '../lib/usageLimits';
import {
  CATEGORY_LABELS,
  getAllFieldEnNames,
  type TemplateFieldsCategory,
} from '../lib/templateFields';
import { FieldSelector } from './FieldSelector';

type Message =
  | null
  | 'uploaded'
  | 'extract_ok'
  | 'extract_fail'
  | 'no_fields'
  | 'cancelled'
  | 'denied'
  | 'error';

function getMessageText(m: Message): string | null {
  if (m === 'uploaded' || m === 'extract_ok') return MSG_EXTRACT_OK;
  if (m === 'extract_fail') return MSG_EXTRACT_ERROR;
  if (m === 'no_fields') return MSG_EXTRACT_NO_FIELDS;
  if (m === 'cancelled') return MSG_CAMERA_CANCELLED;
  if (m === 'denied') return MSG_CAMERA_PERMISSION_DENIED;
  if (m === 'error') return MSG_CAMERA_ERROR;
  return null;
}

const CATEGORIES: TemplateFieldsCategory[] = ['resume', 'contract', 'waybill'];

function getInitialSelectedFields(
  category: TemplateFieldsCategory,
): Set<string> {
  return new Set(getAllFieldEnNames(category));
}

export function DocumentUploadSection() {
  const { auth } = useAuth();
  const [files, setFiles] = useState<PickedFile[] | null>(null);
  const [category, setCategory] = useState<TemplateFieldsCategory>('resume');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(() =>
    getInitialSelectedFields('resume'),
  );
  const [message, setMessage] = useState<Message>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const allEnForCategory = useMemo(
    () => new Set(getAllFieldEnNames(category)),
    [category],
  );

  function showChoice() {
    setMessage(null);
    Alert.alert(UPLOAD_CHOICE_TITLE, UPLOAD_CHOICE_MULTIPLE_HINT, [
      { text: UPLOAD_OPTION_CAMERA, onPress: handleTake },
      { text: UPLOAD_OPTION_GALLERY, onPress: handlePick },
      { text: UPLOAD_OPTION_CANCEL, style: 'cancel' },
    ]);
  }

  async function handleTake() {
    const result = await takeDocumentPhoto();
    if (result.ok) {
      setFiles([{ uri: result.uri, name: 'photo', mimeType: 'image/jpeg' }]);
      setMessage(null);
    } else
      setMessage(
        result.error === 'permission'
          ? 'denied'
          : result.error === 'cancelled'
            ? 'cancelled'
            : 'error',
      );
  }

  async function handlePick() {
    const result = await pickDocumentsFromDevice();
    if (result.ok) {
      setFiles(result.files);
      setMessage(null);
    } else setMessage(result.error === 'cancelled' ? 'cancelled' : 'error');
  }

  function handleToggleField(en: string) {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(en)) next.delete(en);
      else next.add(en);
      return next;
    });
  }

  function handleSelectAll() {
    setSelectedFields(new Set(allEnForCategory));
  }

  function handleDeselectAll() {
    setSelectedFields(new Set());
  }

  async function handleExtract() {
    if (!files?.length || isExtracting) return;
    setMessage(null);
    const usage = await getTodayUsage();
    if (isOverLimit('extract', usage, USAGE_DAILY_LIMIT)) {
      const msg = auth ? MSG_USAGE_EXTRACT_LIMIT : MSG_DEVICE_DAILY_LIMIT;
      Toast.show({ type: 'error', text1: msg });
      return;
    }
    const fields = Array.from(selectedFields);
    if (fields.length === 0) {
      setMessage('no_fields');
      return;
    }
    setIsExtracting(true);
    try {
      const result = await extractDocuments(files, category, fields);
      if (result.ok) {
        Toast.show({ type: 'success', text1: MSG_EXTRACT_OK });
        await incrementUsage('extract');
        setFiles(null);
        setMessage(null);
      } else {
        Toast.show({
          type: 'error',
          text1: MSG_EXTRACT_ERROR,
          text2: result.error,
        });
      }
    } finally {
      setIsExtracting(false);
    }
  }

  const msgText = getMessageText(message);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{LABEL_SECTION_EXTRACT}</Text>
      <Pressable style={styles.button} onPress={showChoice}>
        <Text style={styles.buttonLabel}>{BTN_UPLOAD_DOCUMENT}</Text>
      </Pressable>
      {files != null && files.length > 0 && (
        <>
          <Text style={styles.label}>{LABEL_EXTRACT_FILES}</Text>
          <Text style={styles.fileList}>
            {files.map((f) => f.name).join(', ')}
          </Text>
          <Text style={styles.label}>{LABEL_CATEGORY}</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.categoryBtn,
                  category === c && styles.categoryBtnActive,
                ]}
                onPress={() => {
                  setCategory(c);
                  setSelectedFields(getInitialSelectedFields(c));
                }}
              >
                <Text
                  style={[
                    styles.categoryBtnLabel,
                    category === c && styles.categoryBtnLabelActive,
                  ]}
                >
                  {CATEGORY_LABELS[c]}
                </Text>
              </Pressable>
            ))}
          </View>
          <FieldSelector
            category={category}
            selectedEn={selectedFields}
            onToggle={handleToggleField}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
          <Pressable
            style={[styles.button, isExtracting && styles.buttonDisabled]}
            onPress={handleExtract}
            disabled={isExtracting}
          >
            <Text style={styles.buttonLabel}>
              {isExtracting ? MSG_EXTRACT_LOADING : BTN_EXTRACT}
            </Text>
          </Pressable>
        </>
      )}
      {msgText != null && (
        <View style={styles.messageBlock}>
          <Text style={styles.message}>{msgText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 48 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  label: { fontSize: 14, marginBottom: 8, color: '#333' },
  fileList: { fontSize: 13, color: '#666', marginBottom: 12 },
  categoryRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  categoryBtnActive: { backgroundColor: '#007AFF' },
  categoryBtnLabel: { fontSize: 14, color: '#333' },
  categoryBtnLabelActive: { color: '#fff' },
  messageBlock: { marginTop: 8 },
  message: { fontSize: 14, color: '#666' },
});
