import { StyleSheet } from 'react-native';

const ROOT_FLEX = 1;
const PADDING = 16;
const RADIUS = 8;
const BORDER_WIDTH = 1;
const INPUT_PADDING = 12;
const BTN_PADDING = 14;
const GAP_SM = 8;
const GAP_MD = 16;

const COLOR_BG = '#fff';
const COLOR_TEXT = '#333';
const COLOR_MUTED = '#666';
const COLOR_BORDER = '#ccc';
const COLOR_PRIMARY = '#007AFF';

export const authStyles = StyleSheet.create({
  container: { flex: ROOT_FLEX, padding: PADDING, backgroundColor: COLOR_BG },
  label: { fontSize: 14, marginBottom: 4, color: COLOR_TEXT },
  input: {
    borderWidth: BORDER_WIDTH,
    borderColor: COLOR_BORDER,
    borderRadius: RADIUS,
    padding: INPUT_PADDING,
    marginBottom: GAP_MD,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLOR_PRIMARY,
    padding: BTN_PADDING,
    borderRadius: RADIUS,
    alignItems: 'center',
    marginTop: GAP_SM,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: COLOR_BG, fontSize: 16, fontWeight: '600' },
  link: { marginTop: GAP_MD, alignItems: 'center' },
  linkText: { color: COLOR_PRIMARY, fontSize: 14 },
  helperText: { color: COLOR_MUTED, fontSize: 12, marginBottom: GAP_SM },
});

