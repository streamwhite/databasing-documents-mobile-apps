import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast, {
  ErrorToast,
  InfoToast,
  SuccessToast,
} from 'react-native-toast-message';
import { LimitedFeaturesNotice } from './src/components/LimitedFeaturesNotice';
import { AuthProvider } from './src/context/AuthContext';
import { TabNavigator } from './src/navigation/TabNavigator';

const ROOT_FLEX = 1;

const TOAST_TOP_GAP = 8;
const TOAST_COMPACT_HEIGHT = 44;
const TOAST_CONTENT_PADDING_VERTICAL = 12;

/** Toast colors by type (common practice: green success, red error, blue info). */
const TOAST_SUCCESS_BG = '#e8f5e9';
const TOAST_SUCCESS_BORDER = '#2e7d32';
const TOAST_ERROR_BG = '#ffebee';
const TOAST_ERROR_BORDER = '#c62828';
const TOAST_INFO_BG = '#e3f2fd';
const TOAST_INFO_BORDER = '#1565c0';

const toastStyles = StyleSheet.create({
  base: { height: TOAST_COMPACT_HEIGHT },
  content: { paddingVertical: TOAST_CONTENT_PADDING_VERTICAL },
  success: {
    backgroundColor: TOAST_SUCCESS_BG,
    borderLeftColor: TOAST_SUCCESS_BORDER,
  },
  error: {
    backgroundColor: TOAST_ERROR_BG,
    borderLeftColor: TOAST_ERROR_BORDER,
  },
  info: {
    backgroundColor: TOAST_INFO_BG,
    borderLeftColor: TOAST_INFO_BORDER,
  },
});

function ToastWithConfig() {
  const insets = useSafeAreaInsets();
  const config = useMemo(
    () => ({
      success: (props: React.ComponentProps<typeof SuccessToast>) => (
        <SuccessToast
          {...props}
          style={[props.style, toastStyles.base, toastStyles.success]}
          contentContainerStyle={toastStyles.content}
        />
      ),
      error: (props: React.ComponentProps<typeof ErrorToast>) => (
        <ErrorToast
          {...props}
          style={[props.style, toastStyles.base, toastStyles.error]}
          contentContainerStyle={toastStyles.content}
        />
      ),
      info: (props: React.ComponentProps<typeof InfoToast>) => (
        <InfoToast
          {...props}
          style={[props.style, toastStyles.base, toastStyles.info]}
          contentContainerStyle={toastStyles.content}
        />
      ),
    }),
    [],
  );
  return <Toast config={config} topOffset={insets.top + TOAST_TOP_GAP} />;
}

export default function App() {
  const [showLimitedNotice, setShowLimitedNotice] = useState(true);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <TabNavigator />
            <StatusBar style='auto' />
          </NavigationContainer>
        </AuthProvider>
        <ToastWithConfig />
        <LimitedFeaturesNotice
          visible={showLimitedNotice}
          onDismiss={() => setShowLimitedNotice(false)}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: ROOT_FLEX },
});
