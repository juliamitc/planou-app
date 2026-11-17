import { StyleSheet } from 'react-native';

export const tagStyles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    paddingLeft: 9,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    borderWidth: 1,
    maxWidth: '100%',
  },
  labelButton: {
    height: 27,
    minHeight: 27,
    minWidth: 0,
    paddingLeft: 7,
    paddingRight: 3,
    borderRadius: 6,
    gap: 5,
    flexShrink: 1,
  },
  label: { fontSize: 12, flexShrink: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  removeButton: {
    width: 24,
    minWidth: 24,
    height: 25,
    minHeight: 25,
    padding: 0,
    borderRadius: 6,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    padding: 3,
    alignItems: 'center',
  },
  swatch: {
    width: 23,
    minWidth: 23,
    height: 28,
    minHeight: 28,
    padding: 0,
    borderRadius: 6,
  },
  colorMenu: { padding: 3, borderWidth: 1, borderRadius: 9 },
  colorDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  custom: { padding: 6, gap: 8 },
  hexInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    fontSize: 13,
  },
});

export const hueStyle = {
  appearance: 'none',
  background:
    'linear-gradient(to right, #d47c7c, #d4d47c, #7cd47c, #7cd4d4, #7c7cd4, #d47cd4, #d47c7c)',
  width: '100%',
  height: 5,
  borderRadius: 4,
} as const;
