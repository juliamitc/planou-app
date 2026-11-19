import type { CSSProperties } from 'react';
import { StyleSheet } from 'react-native';

import { clay, layoutColors, type LayoutTheme } from '../../theme/colors';
import { fontFamilies } from '../../theme/fonts';

function appearance(theme: LayoutTheme) {
  const colors = layoutColors[theme];
  return StyleSheet.create({
    text: { color: colors.text },
    muted: { color: colors.muted },
    surface: { backgroundColor: colors.surface, borderColor: colors.border },
    dayHeader: { borderColor: colors.border },
    today: { backgroundColor: colors.selection },
    todayText: { color: colors.selectionInk },
    event: {
      backgroundColor: colors.selection,
      borderLeftColor: colors.selectionInk,
    },
  });
}

export const styles = {
  light: appearance('light'),
  dark: appearance('dark'),
  base: StyleSheet.create({
    page: { padding: 24, gap: 18 },
    header: { gap: 8 },
    back: { alignSelf: 'flex-start', paddingHorizontal: 0, gap: 7 },
    title: { fontSize: 27, lineHeight: 34 },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
    weekTitle: { fontSize: 15, marginRight: 'auto' },
    iconButton: {
      width: 30,
      minWidth: 30,
      minHeight: 30,
      padding: 0,
      borderRadius: 8,
    },
    action: { minHeight: 36, borderRadius: 9, gap: 7 },
    primary: { backgroundColor: clay, borderColor: clay },
    primaryText: { color: '#fff' },
    week: { flexDirection: 'row', flexGrow: 1, gap: 8, padding: 2 },
    day: {
      flex: 1,
      minWidth: 106,
      minHeight: 245,
      borderWidth: 1,
      borderRadius: 10,
    },
    dayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 8,
      borderBottomWidth: 1,
      borderTopLeftRadius: 9,
      borderTopRightRadius: 9,
    },
    dayLabel: { fontSize: 12, lineHeight: 16 },
    dayNumber: { fontSize: 18, lineHeight: 23 },
    events: { padding: 6, gap: 6 },
    event: {
      minWidth: 0,
      minHeight: 42,
      alignItems: 'stretch',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingHorizontal: 7,
      paddingVertical: 6,
      gap: 2,
      borderLeftWidth: 3,
      borderRadius: 6,
    },
    eventTitle: { fontSize: 12, lineHeight: 16 },
    time: { fontSize: 11, lineHeight: 15 },
    formRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    formField: { flex: 1, minWidth: 118, gap: 7 },
    deleteButton: { marginRight: 'auto' },
    bodyFont: { fontFamily: fontFamilies.body },
    headingFont: { fontFamily: fontFamilies.heading },
  }),
};

export function dateInputStyle(theme: LayoutTheme): CSSProperties {
  const colors = layoutColors[theme];
  return {
    colorScheme: theme,
    color: colors.text,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 9,
    boxSizing: 'border-box',
    minHeight: 42,
    width: '100%',
    padding: '8px 11px',
    fontFamily: fontFamilies.body,
    fontSize: 14,
    outlineColor: colors.selectionInk,
  };
}
