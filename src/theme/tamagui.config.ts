import { defaultConfig } from '@tamagui/config/v6';
import { createTamagui } from '@tamagui/core';

export const tamaguiConfig = createTamagui(defaultConfig);

type AppConfig = typeof tamaguiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
