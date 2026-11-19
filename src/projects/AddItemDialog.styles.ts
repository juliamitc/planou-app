import { StyleSheet } from 'react-native';

import { clay, layoutColors, type LayoutTheme } from '../theme/colors';
import { fontFamilies } from '../theme/fonts';

function appearance(theme: LayoutTheme) {
  const colors = layoutColors[theme];
  return StyleSheet.create({
    content: {
      backgroundColor: colors.sidebar,
      borderColor: colors.border,
      boxShadow: `0 18px 60px ${colors.shadow}`,
    },
    text: { color: colors.text },
    muted: { color: colors.muted },
    option: { backgroundColor: colors.surface, borderColor: colors.border },
    optionIcon: { backgroundColor: colors.selection },
    selectedIcon: { backgroundColor: colors.selectionInk },
    selected: {
      backgroundColor: colors.selection,
      borderColor: colors.selectionInk,
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text,
      outlineColor: colors.selectionInk,
    },
    footer: { borderColor: colors.border },
    error: { color: theme === 'dark' ? '#f2a79b' : '#a53930' },
  });
}

export const styles = {
  light: appearance('light'),
  dark: appearance('dark'),
  base: StyleSheet.create({
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.38)' },
    content: {
      width: 520,
      maxWidth: '94%',
      maxHeight: '85%',
      padding: 0,
      borderWidth: 1,
      borderRadius: 18,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      padding: 24,
      paddingBottom: 18,
    },
    heading: { flex: 1, minWidth: 0, gap: 5 },
    title: { fontSize: 23, lineHeight: 30 },
    subtitle: { fontSize: 14, lineHeight: 20 },
    close: {
      width: 32,
      minWidth: 32,
      height: 32,
      minHeight: 32,
      padding: 0,
      borderRadius: 8,
    },
    body: { paddingHorizontal: 24, paddingBottom: 24, gap: 18 },
    options: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 10,
      marginHorizontal: -5,
    },
    optionCell: { width: '50%', paddingHorizontal: 5 },
    option: {
      flex: 1,
      minHeight: 76,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 10,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderRadius: 11,
    },
    optionIcon: {
      width: 26,
      height: 26,
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
    },
    optionCopy: { flex: 1, minWidth: 0, gap: 3 },
    optionTitle: { fontSize: 14, lineHeight: 19, textAlign: 'left' },
    description: { fontSize: 12, lineHeight: 17, textAlign: 'left' },
    field: { gap: 7 },
    formats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    format: { minHeight: 36, borderRadius: 8 },
    label: { fontSize: 13, lineHeight: 18 },
    input: {
      minHeight: 42,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderWidth: 1,
      borderRadius: 9,
      fontSize: 14,
      outlineWidth: 2,
      outlineOffset: 2,
      outlineStyle: 'solid',
    },
    footer: {
      padding: 16,
      paddingHorizontal: 24,
      gap: 8,
      borderTopWidth: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    footerButton: { minHeight: 38, minWidth: 78, borderRadius: 9 },
    saveButton: { backgroundColor: clay, borderColor: clay },
    saveText: { color: '#ffffff' },
    error: { fontSize: 13, lineHeight: 18 },
    bodyFont: { fontFamily: fontFamilies.body },
    headingFont: { fontFamily: fontFamilies.heading },
  }),
};
