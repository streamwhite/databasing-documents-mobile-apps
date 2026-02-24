import * as ImagePicker from 'expo-image-picker';

export type TakeDocumentPhotoResult =
  | { ok: true; uri: string }
  | { ok: false; error: 'permission' | 'cancelled' | 'unknown' };

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === ImagePicker.PermissionStatus.GRANTED;
}

export async function takeDocumentPhoto(): Promise<TakeDocumentPhotoResult> {
  try {
    const granted = await requestCameraPermission();
    if (!granted) return { ok: false, error: 'permission' };

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return { ok: false, error: 'cancelled' };
    const uri = result.assets[0]?.uri;
    if (!uri) return { ok: false, error: 'unknown' };
    return { ok: true, uri };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}

export type PickDocumentResult =
  | { ok: true; uri: string }
  | { ok: false; error: 'permission' | 'cancelled' | 'unknown' };

export async function pickDocumentFromPhone(): Promise<PickDocumentResult> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED)
      return { ok: false, error: 'permission' };

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return { ok: false, error: 'cancelled' };
    const uri = result.assets[0]?.uri;
    if (!uri) return { ok: false, error: 'unknown' };
    return { ok: true, uri };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}
