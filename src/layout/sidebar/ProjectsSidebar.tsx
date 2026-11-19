import { ChevronRight, PanelLeftClose, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Button } from 'tamagui/button';

import type { Project, ProjectDetails } from '../../projects/projects';
import type { ProjectTag } from '../../projects/projectTags';
import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../../theme/colors';
import { sidebarInset } from '../layoutDimensions';
import { ProjectDraft } from './ProjectDraft';
import { ProjectRow, projectActionsId } from './ProjectRow';
import {
  sidebarButtonSize,
  sidebarToggleInset,
  styles,
} from './ProjectsSidebar.styles';
import { TagDraft } from './TagDraft';

type ProjectsSidebarProps = {
  theme: LayoutTheme;
  width: number;
  collapsed: boolean;
  fontsLoaded: boolean;
  projects: Project[];
  knownTags: ProjectTag[];
  activeTag?: string;
  tagProjectId?: string;
  selectedProjectId?: string;
  draft?: 'new' | Project;
  onToggle: () => void;
  onAddProject: () => void;
  onAddItem: (id: string) => void;
  onSaveProject: (details: ProjectDetails) => boolean;
  onEditProject: (project: Project) => void;
  onTogglePinned: (id: string) => boolean;
  onRemoveProject: (id: string) => boolean;
  onCloseDraft: () => void;
  onSelectProject: (id: string) => void;
  onStartTag: (id: string) => void;
  onCloseTag: () => void;
  onSaveTag: (id: string, tag: ProjectTag) => boolean;
  onRemoveTag: (id: string, name: string) => boolean;
  onToggleTag: (name: string) => void;
};

const addProjectButtonId = 'add-project';

function focusSidebarButton(id: string) {
  if (typeof document === 'undefined') return;

  requestAnimationFrame(() => document.getElementById(id)?.focus());
}

export function ProjectsSidebar({
  theme,
  width,
  collapsed,
  fontsLoaded,
  projects,
  knownTags,
  activeTag,
  tagProjectId,
  selectedProjectId,
  draft,
  onToggle,
  onAddProject,
  onAddItem,
  onSaveProject,
  onEditProject,
  onTogglePinned,
  onRemoveProject,
  onCloseDraft,
  onSelectProject,
  onStartTag,
  onCloseTag,
  onSaveTag,
  onRemoveTag,
  onToggleTag,
}: ProjectsSidebarProps) {
  const colors = layoutColors[theme];
  const focusStyles = buttonFocusStyles(theme);
  const appearance = styles[theme];
  const [progress] = useState(() => new Animated.Value(collapsed ? 0 : 1));
  const [reduceMotion, setReduceMotion] = useState(true);
  const orderedProjects = [
    ...projects.filter((project) => project.pinned),
    ...projects.filter((project) => !project.pinned),
  ];

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
            id={addProjectButtonId}
            size="sm"
            style={[styles.base.iconButton, styles.base.addButton]}
            variant="quiet"
            aria-label="Add project"
            {...focusStyles}
            disabled={
              collapsed || draft !== undefined || tagProjectId !== undefined
            }
            onPress={onAddProject}
          >
            <View style={styles.base.addIcon}>
              <Plus size={18} strokeWidth={2.2} color="#ffffff" />
            </View>
          </Button>
        </View>
        {draft === 'new' && (
          <ProjectDraft
            theme={theme}
            fontsLoaded={fontsLoaded}
            active={!collapsed}
            onSave={onSaveProject}
            onClose={onCloseDraft}
            onRestoreFocus={() => focusSidebarButton(addProjectButtonId)}
          />
        )}
        <ScrollView
          style={styles.base.projectList}
          contentContainerStyle={styles.base.projectListContent}
        >
          {orderedProjects.map((project) => (
            <View key={project.id}>
              {draft && draft !== 'new' && draft.id === project.id ? (
                <ProjectDraft
                  theme={theme}
                  fontsLoaded={fontsLoaded}
                  active={!collapsed}
                  initialDetails={draft}
                  onSave={onSaveProject}
                  onClose={onCloseDraft}
                  onRestoreFocus={() =>
                    focusSidebarButton(projectActionsId(project.id))
                  }
                />
              ) : (
                <ProjectRow
                  project={project}
                  theme={theme}
                  fontsLoaded={fontsLoaded}
                  selected={project.id === selectedProjectId}
                  disabled={collapsed}
                  activeTag={activeTag}
                  onSelect={() => onSelectProject(project.id)}
                  onEdit={() => onEditProject(project)}
                  onAddTag={() => onStartTag(project.id)}
                  onAddItem={() => onAddItem(project.id)}
                  onToggleTag={onToggleTag}
                  onRemoveTag={(name) => onRemoveTag(project.id, name)}
                  onTogglePinned={() => onTogglePinned(project.id)}
                  onRemove={() => {
                    const removed = onRemoveProject(project.id);
                    if (removed) focusSidebarButton(addProjectButtonId);
                    return removed;
                  }}
                />
              )}
              {tagProjectId === project.id && (
                <TagDraft
                  theme={theme}
                  active={!collapsed}
                  projectTags={project.tags ?? []}
                  knownTags={knownTags}
                  onSave={(tag) => onSaveTag(project.id, tag)}
                  onClose={onCloseTag}
                  onRestoreFocus={() =>
                    focusSidebarButton(projectActionsId(project.id))
                  }
                />
              )}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}
