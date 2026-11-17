import { ChevronRight, PanelLeftClose, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Text, View } from 'react-native';
import { Button } from 'tamagui/button';

import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../../theme/colors';
import { sidebarInset } from '../layoutDimensions';
import {
  sidebarButtonSize,
  sidebarToggleInset,
  styles,
} from './ProjectsSidebar.styles';

type ProjectsSidebarProps = {
  theme: LayoutTheme;
  width: number;
  collapsed: boolean;
  fontsLoaded: boolean;
  onToggle: () => void;
  onAddProject?: () => void;
};

export function ProjectsSidebar({
  theme,
  width,
  collapsed,
  fontsLoaded,
  onToggle,
  onAddProject,
}: ProjectsSidebarProps) {
  const colors = layoutColors[theme];
  const focusStyles = buttonFocusStyles(theme);
  const appearance = styles[theme];
  const [progress] = useState(() => new Animated.Value(collapsed ? 0 : 1));
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const target = collapsed ? 0 : 1;

    if (reduceMotion) {
      progress.setValue(target);
      return;
    }

    const animation = Animated.timing(progress, {
      toValue: target,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [collapsed, progress, reduceMotion]);

  const slotWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [sidebarButtonSize, width + sidebarInset],
  });
  const panelOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width - sidebarInset, 0],
  });
  const panelOpacity = progress.interpolate({
    inputRange: [0, 0.12, 1],
    outputRange: [0, 1, 1],
  });
  const toggleOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width + sidebarInset - sidebarToggleInset],
  });

  return (
    <Animated.View style={[styles.base.slot, { width: slotWidth }]}>
      <Animated.View
        style={[
          styles.base.toggle,
          { transform: [{ translateX: toggleOffset }] },
        ]}
      >
        <Button
          size="sm"
          style={[
            styles.base.iconButton,
            collapsed && styles.base.tab,
            collapsed && appearance.tab,
          ]}
          aria-label={collapsed ? 'Expand projects' : 'Collapse projects'}
          aria-expanded={!collapsed}
          variant={collapsed ? 'outlined' : 'quiet'}
          {...focusStyles}
          onPress={onToggle}
        >
          {collapsed ? (
            <ChevronRight
              size={16}
              strokeWidth={1.6}
              color={colors.selectionInk}
            />
          ) : (
            <PanelLeftClose size={18} color={colors.muted} />
          )}
        </Button>
      </Animated.View>

      <Animated.View
        aria-hidden={collapsed}
        accessibilityElementsHidden={collapsed}
        importantForAccessibility={collapsed ? 'no-hide-descendants' : 'auto'}
        style={[
          styles.base.sidebar,
          appearance.sidebar,
          collapsed && styles.base.hiddenPanel,
          {
            width,
            opacity: panelOpacity,
            transform: [{ translateX: panelOffset }],
          },
        ]}
      >
        <View style={[styles.base.header, appearance.header]}>
          <Text
            accessibilityRole="header"
            style={[
              styles.base.title,
              fontsLoaded && styles.base.titleFont,
              appearance.title,
            ]}
          >
            Projects
          </Text>
          <Button
            size="sm"
            style={[
              styles.base.iconButton,
              styles.base.addButton,
              !onAddProject && styles.base.addButtonDisabled,
            ]}
            variant="quiet"
            aria-label="Add project"
            {...focusStyles}
            disabled={collapsed || !onAddProject}
            onPress={onAddProject}
          >
            <View style={[styles.base.addIcon, appearance.addIcon]}>
              <Plus size={18} color={colors.selectionInk} />
            </View>
          </Button>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
