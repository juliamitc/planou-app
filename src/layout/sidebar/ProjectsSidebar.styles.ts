import { StyleSheet } from 'react-native';

import { clay, layoutColors, type LayoutTheme } from '../../theme/colors';
import { fontFamilies } from '../../theme/fonts';
import { sidebarInset } from '../layoutDimensions';

export const sidebarButtonSize = 44;
const panelBorder = 1;
const panelPadding = 10;
export const sidebarToggleInset =
  panelBorder + panelPadding + sidebarButtonSize * 2;

function appearance(theme: LayoutTheme) {
  const colors = layoutColors[theme];

  return StyleSheet.create({
    sidebar: {
      backgroundColor: colors.sidebar,
      borderColor: colors.border,
      boxShadow: `0 8px 24px ${colors.shadow}, inset 0 1px 0 ${colors.highlight}`,
    },
    tab: {
      backgroundColor: colors.sidebar,
      borderColor: colors.border,
      boxShadow: `0 3px 10px ${colors.shadow}`,
    },
    header: { borderColor: colors.border },
    title: { color: colors.text },
    text: { color: colors.text },
    selectedRow: { backgroundColor: colors.selection },
    draftRow: { backgroundColor: colors.surface, borderColor: colors.border },
    draftFocused: { borderColor: colors.selectionInk },
    danger: { color: theme === 'dark' ? '#f2a79b' : '#a53930' },
    actionDivider: { backgroundColor: colors.border },
    iconMenu: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      boxShadow: `0 4px 12px ${colors.shadow}`,
    },
  });
}

export const styles = {
  light: appearance('light'),
  dark: appearance('dark'),
  base: StyleSheet.create({
    sidebar: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: sidebarInset,
      borderWidth: panelBorder,
      borderRadius: 18,
      paddingHorizontal: panelPadding,
      paddingTop: 7,
    },
    slot: { zIndex: 1 },
    hiddenPanel: { pointerEvents: 'none' },
    toggle: { position: 'absolute', top: 8, left: 0, zIndex: 1 },
    tab: {
      width: sidebarButtonSize,
      borderLeftWidth: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 13,
      borderBottomRightRadius: 13,
      outlineOffset: -3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 6,
      borderBottomWidth: 1,
    },
    title: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22,
      marginStart: 9,
      marginEnd: sidebarButtonSize,
    },
    titleFont: { fontFamily: fontFamilies.heading },
    iconButton: {
      minWidth: sidebarButtonSize,
      minHeight: sidebarButtonSize,
      paddingHorizontal: 8,
      borderRadius: 10,
    },
    addButton: { paddingHorizontal: 0 },
    addIcon: {
      width: 31,
      height: 31,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: clay,
    },
    bodyFont: { fontFamily: fontFamilies.body },
    draft: { marginTop: 9, gap: 6 },
    draftRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      padding: 3,
      borderWidth: 1,
      borderRadius: 10,
    },
    draftInput: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 3,
      paddingVertical: 2,
      fontSize: 14,
      outlineStyle: 'solid',
      outlineWidth: 0,
    },
    draftButton: {
      height: 32,
      width: 32,
      minWidth: 32,
      minHeight: 32,
      padding: 0,
      borderRadius: 7,
    },
    iconPicker: {
      height: 32,
      minHeight: 32,
      minWidth: 36,
      gap: 2,
      paddingHorizontal: 4,
      borderRadius: 7,
    },
    iconMenu: {
      alignSelf: 'flex-start',
      width: 190,
      padding: 6,
      gap: 4,
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderWidth: 1,
      borderRadius: 11,
    },
    saveError: { fontSize: 12, lineHeight: 17, paddingHorizontal: 4 },
    projectList: { flex: 1, marginTop: 7 },
    projectListContent: { gap: 3, paddingHorizontal: 2, paddingVertical: 3 },
    projectRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 3,
      borderRadius: 8,
    },
    projectLink: {
      flex: 1,
      minWidth: 0,
      minHeight: 38,
      paddingHorizontal: 9,
      gap: 8,
      justifyContent: 'flex-start',
      borderRadius: 8,
    },
    projectName: { flex: 1, fontSize: 14, lineHeight: 20 },
    actionMenu: {
      width: 198,
      gap: 2,
      padding: 5,
      borderWidth: 1,
      borderRadius: 11,
      alignItems: 'stretch',
    },
    action: {
      minHeight: 36,
      paddingHorizontal: 8,
      gap: 9,
      justifyContent: 'flex-start',
      borderRadius: 7,
    },
    unavailableAction: { opacity: 0.48 },
    actionDivider: { height: 1, marginHorizontal: 4, marginVertical: 4 },
    confirmRemove: { gap: 8, padding: 8 },
    confirmButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 5,
    },
  }),
};
