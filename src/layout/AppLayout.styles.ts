import { StyleSheet } from 'react-native';

import { clay, layoutColors, type LayoutTheme } from '../theme/colors';
import { fontFamilies } from '../theme/fonts';
import { sidebarInset } from './layoutDimensions';

function appearance(theme: LayoutTheme) {
  const colors = layoutColors[theme];

  return StyleSheet.create({
    screen: { backgroundColor: colors.background },
    label: { color: colors.text },
    muted: { color: colors.muted },
    itemRow: { backgroundColor: colors.surface, borderColor: colors.border },
    newProjectButton: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    newProjectLabel: { color: colors.selectionInk },
    menu: { backgroundColor: colors.surface, borderColor: colors.border },
    themeTrigger: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      boxShadow: `0 2px 6px ${colors.shadow}`,
    },
  });
}

export const styles = {
  light: appearance('light'),
  dark: appearance('dark'),
  base: StyleSheet.create({
    screen: { flex: 1 },
    menu: {
      width: 186,
      padding: 5,
      gap: 2,
      borderWidth: 1,
      borderRadius: 12,
      alignItems: 'stretch',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
    },
    themeTrigger: {
      minWidth: 62,
      minHeight: 44,
      paddingHorizontal: 12,
      borderRadius: 22,
      gap: 7,
    },
    themeOption: {
      minHeight: 44,
      justifyContent: 'flex-start',
      gap: 9,
      borderRadius: 8,
    },
    header: {
      minHeight: 72,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    body: {
      flex: 1,
      flexDirection: 'row',
      paddingRight: sidebarInset,
      paddingBottom: sidebarInset,
      gap: sidebarInset,
    },
    brand: { color: clay, fontSize: 31 },
    brandFont: { fontFamily: fontFamilies.brand },
    optionLabel: { flex: 1, fontSize: 14, lineHeight: 20 },
    optionFont: { fontFamily: fontFamilies.body },
    content: { flex: 1, minWidth: 0 },
    emptyProjects: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 24,
    },
    projectOverview: { paddingHorizontal: 32, paddingVertical: 24, gap: 12 },
    projectHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    pageTitle: { flexShrink: 1, fontSize: 27, lineHeight: 34 },
    pageCopy: { fontSize: 14, lineHeight: 20 },
    headingFont: { fontFamily: fontFamilies.heading },
    newProjectButton: { minHeight: 40, borderRadius: 9 },
    addItemButton: {
      alignSelf: 'flex-start',
      minHeight: 38,
      borderRadius: 9,
      gap: 7,
    },
    itemList: { gap: 8, marginTop: 8 },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderWidth: 1,
      borderRadius: 10,
    },
    itemTitle: { flex: 1, minWidth: 0, fontSize: 14, lineHeight: 20 },
    itemType: { fontSize: 12 },
  }),
};
