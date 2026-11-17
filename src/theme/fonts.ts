import { Calistoga_400Regular } from '@expo-google-fonts/calistoga/400Regular';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';

export const fontFamilies = {
  brand: 'Calistoga_400Regular',
  body: 'DMSans_400Regular',
  heading: 'DMSans_500Medium',
} as const;

export const appFonts = {
  [fontFamilies.brand]: Calistoga_400Regular,
  [fontFamilies.body]: DMSans_400Regular,
  [fontFamilies.heading]: DMSans_500Medium,
};
