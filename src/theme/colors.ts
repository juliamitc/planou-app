export const clay = '#a66550';

export const layoutColors = {
  light: {
    background: '#f4f2ee',
    sidebar: '#fbfaf7',
    surface: '#fffefa',
    text: '#282725',
    muted: '#65615b',
    border: '#e5e0da',
    shadow: 'rgba(48, 38, 24, 0.10)',
    highlight: 'rgba(255, 255, 255, 0.90)',
    selection: '#f0e7e1',
    selectionInk: '#895746',
  },
  dark: {
    background: '#222222',
    sidebar: '#2c2c2c',
    surface: '#303030',
    text: '#ececec',
    muted: '#bdb9b5',
    border: '#414141',
    shadow: 'rgba(0, 0, 0, 0.26)',
    highlight: 'rgba(255, 255, 255, 0.045)',
    selection: '#483934',
    selectionInk: '#c29b8e',
  },
} as const;

export type LayoutTheme = keyof typeof layoutColors;

export function buttonFocusStyles(theme: LayoutTheme) {
  return {
    outlineColor: `focus-visible:${layoutColors[theme].selectionInk}`,
    outlineOffset: 2,
  } as const;
}
