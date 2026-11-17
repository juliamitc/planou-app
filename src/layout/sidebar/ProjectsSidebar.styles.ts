import { StyleSheet } from 'react-native';

import { layoutColors, type LayoutTheme } from '../../theme/colors';
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
    addIcon: { backgroundColor: colors.selection },
    title: { color: colors.text },
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
    addButtonDisabled: { opacity: 0.65 },
    addIcon: {
      width: 31,
      height: 31,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
};
