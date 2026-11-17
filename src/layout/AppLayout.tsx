import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Text, useColorScheme, useWindowDimensions, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Button } from 'tamagui/button';
import { Popover } from 'tamagui/popover';
import { TamaguiProvider } from 'tamagui/provider';

import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../theme/colors';
import { appFonts } from '../theme/fonts';
import { tamaguiConfig } from '../theme/tamagui.config';
import { styles } from './AppLayout.styles';
import { desktopSidebarWidth, sidebarInset } from './layoutDimensions';
import { ProjectsSidebar } from './sidebar/ProjectsSidebar';

const themes = [
  { value: 'automatic', label: 'Automatic', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
] as const;

type ThemePreference = (typeof themes)[number]['value'];

type AppLayoutProps = {
  children?: ReactNode;
  onAddProject?: () => void;
};

export function AppLayout({ children, onAddProject }: AppLayoutProps) {
  const [fontsLoaded] = useFonts(appFonts);
  const [preference, setPreference] = useState<ThemePreference>('automatic');
  const [sidebarOverride, setSidebarOverride] = useState<boolean>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const systemTheme = useColorScheme();

  const compact = width < 680;
  const sidebarWidth = compact
    ? width - insets.left - insets.right - sidebarInset * 2
    : desktopSidebarWidth;
  const collapsed = sidebarOverride ?? compact;
  const theme =
    preference === 'automatic'
      ? systemTheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;
  const colors = layoutColors[theme];
  const focusStyles = buttonFocusStyles(theme);
  const activeOption =
    themes.find((option) => option.value === preference) ?? themes[0];
  const ThemeIcon = activeOption.Icon;
  const appearance = styles[theme];

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <SafeAreaView style={[styles.base.screen, appearance.screen]}>
        <View style={styles.base.header}>
          <Text
            style={[styles.base.brand, fontsLoaded && styles.base.brandFont]}
          >
            Planou.
          </Text>

          <Popover placement="bottom-end" offset={10}>
            <Popover.Trigger asChild>
              <Button
                size="sm"
                style={[styles.base.themeTrigger, appearance.themeTrigger]}
                variant="outlined"
                aria-label={`Theme: ${activeOption.label}`}
                {...focusStyles}
              >
                <ThemeIcon size={17} color={colors.text} />
                <ChevronDown size={12} color={colors.muted} />
              </Button>
            </Popover.Trigger>

            <Popover.Content style={[styles.base.menu, appearance.menu]}>
              {themes.map(({ value, label, Icon }) => {
                const selected = value === preference;

                return (
                  <Popover.Close key={value} asChild>
                    <Button
                      size="sm"
                      variant="quiet"
                      style={styles.base.themeOption}
                      aria-pressed={selected}
                      {...focusStyles}
                      onPress={() => setPreference(value)}
                      backgroundColor={
                        selected ? colors.selection : 'transparent'
                      }
                    >
                      <Icon
                        size={16}
                        color={selected ? colors.selectionInk : colors.muted}
                      />
                      <Text
                        style={[
                          styles.base.optionLabel,
                          fontsLoaded && styles.base.optionFont,
                          appearance.label,
                        ]}
                      >
                        {label}
                      </Text>
                      {selected && (
                        <Check size={15} color={colors.selectionInk} />
                      )}
                    </Button>
                  </Popover.Close>
                );
              })}
            </Popover.Content>
          </Popover>
        </View>

        <View style={styles.base.body}>
          <ProjectsSidebar
            theme={theme}
            width={sidebarWidth}
            collapsed={collapsed}
            fontsLoaded={fontsLoaded}
            onToggle={() => setSidebarOverride(!collapsed)}
            onAddProject={onAddProject}
          />
          {(!compact || collapsed) && (
            <View style={styles.base.content}>{children}</View>
          )}
        </View>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    </TamaguiProvider>
  );
}
