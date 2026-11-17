import { StyleSheet } from 'react-native';

import { projectTitleInset } from './ProjectsSidebar.styles';

const tagHeight = 18;
const tagEdgeWidth = 7;
const tagHoleSize = 4;

export const tagStyles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    paddingLeft: projectTitleInset,
    paddingRight: 4,
    paddingBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  tagEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderTopWidth: tagHeight / 2,
    borderBottomWidth: tagHeight / 2,
    borderRightWidth: tagEdgeWidth,
    borderColor: 'transparent',
  },
  tagBody: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: tagEdgeWidth,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  outlinedEdge: {
    top: 2,
    left: 2.5,
    borderTopWidth: (tagHeight - 4) / 2,
    borderBottomWidth: (tagHeight - 4) / 2,
    borderRightWidth: 5.5,
  },
  outlinedBody: {
    top: 2,
    bottom: 2,
    right: 2,
    left: 8,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
  tagHole: {
    position: 'absolute',
    left: 6,
    top: (tagHeight - tagHoleSize) / 2,
    width: tagHoleSize,
    height: tagHoleSize,
    borderRadius: tagHoleSize / 2,
  },
  labelButton: {
    height: tagHeight,
    minHeight: tagHeight,
    minWidth: 0,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 3,
    justifyContent: 'center',
    flexShrink: 1,
  },
  label: { fontSize: 11, lineHeight: 14, flexShrink: 1, textAlign: 'center' },
  removeButton: {
    position: 'absolute',
    right: 0,
    width: 15,
    minWidth: 15,
    height: tagHeight,
    minHeight: tagHeight,
    padding: 0,
    borderRadius: 4,
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
