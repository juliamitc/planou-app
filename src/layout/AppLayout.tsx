import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import {
  Platform,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Button } from 'tamagui/button';
import { Popover } from 'tamagui/popover';
import { TamaguiProvider } from 'tamagui/provider';

import { AddItemDialog } from '../projects/AddItemDialog';
import type { CalendarEvent } from '../projects/calendar/calendarEvents';
import type { ItemDetails } from '../projects/projectItems';
import { hasTag, tagKey, type ProjectTag } from '../projects/projectTags';
import {
  loadProjects,
  saveProjectChanges,
  type Project,
  type ProjectChange,
  type ProjectDetails,
} from '../projects/projects';
import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../theme/colors';
import { appFonts } from '../theme/fonts';
import { tamaguiConfig } from '../theme/tamagui.config';
import { styles } from './AppLayout.styles';
import { ProjectContent } from './ProjectContent';
import { desktopSidebarWidth, sidebarInset } from './layoutDimensions';
import { projectActionsId } from './sidebar/ProjectRow';
import { ProjectsSidebar } from './sidebar/ProjectsSidebar';

const themes = [
  { value: 'automatic', label: 'Automatic', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
] as const;

type ThemePreference = (typeof themes)[number]['value'];

export function AppLayout() {
  const [fontsLoaded] = useFonts(appFonts);
  const [projects, setProjects] = useState(loadProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [openBoardId, setOpenBoardId] = useState<string>();
  const [draft, setDraft] = useState<'new' | Project>();
  const [tagProjectId, setTagProjectId] = useState<string>();
  const [activeTag, setActiveTag] = useState<string>();
  const [itemDialog, setItemDialog] = useState<{
    projectId: string;
    returnFocusId: string;
  }>();
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
  const shownProjects = activeTag
    ? projects.filter((project) => hasTag(project.tags, activeTag))
    : projects;
  const selectedProject = shownProjects.find(
    (project) => project.id === selectedProjectId,
  );
  const itemProject = projects.find(
    (project) => project.id === itemDialog?.projectId,
  );

  function selectProject(id?: string) {
    setSelectedProjectId(id);
    setOpenBoardId(undefined);
  }

  function startItem(projectId: string, returnFocusId: string) {
    if (draft || tagProjectId) return;
    setItemDialog({ projectId, returnFocusId });
  }

  function saveItem(details: ItemDetails) {
    if (!itemDialog) return false;
    const item = {
      ...details,
      id:
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    const saved = changeProjects((current) => {
      if (!current.some((project) => project.id === itemDialog.projectId)) {
        throw new Error('The project no longer exists.');
      }
      return current.map((project) =>
        project.id === itemDialog.projectId
          ? { ...project, items: [...(project.items ?? []), item] }
          : project,
      );
    });
    if (saved) {
      selectProject(itemDialog.projectId);
      if (compact) setSidebarOverride(true);
    }
    return saved;
  }

  function startProject() {
    if (tagProjectId) return;
    setSidebarOverride(false);
    setDraft((current) => current ?? 'new');
  }

  function changeProjects(change: ProjectChange) {
    try {
      const nextProjects =
        Platform.OS === 'web' ? saveProjectChanges(change) : change(projects);
      setProjects(nextProjects);
      if (
        activeTag &&
        !nextProjects.some((project) => hasTag(project.tags, activeTag))
      ) {
        setActiveTag(undefined);
      }
      return true;
    } catch {
      return false;
    }
  }

  function changeCalendarEvents(
    projectId: string,
    boardId: string,
    change: (events: CalendarEvent[]) => CalendarEvent[],
  ) {
    return changeProjects((current) => {
      const project = current.find((item) => item.id === projectId);
      const board = project?.items?.find(
        (item) => item.id === boardId && item.boardFormat === 'calendar',
      );
      if (!board) throw new Error('The calendar no longer exists.');

      const events = change(board.events ?? []);
      return current.map((item) =>
        item.id === projectId
          ? {
              ...item,
              items: item.items?.map((entry) =>
                entry.id === boardId ? { ...entry, events } : entry,
              ),
            }
          : item,
      );
    });
  }

  function addTag(id: string, tag: ProjectTag) {
    const key = tagKey(tag.name);
    return changeProjects((current) => {
      const existing = current
        .flatMap((project) => project.tags ?? [])
        .find((item) => tagKey(item.name) === key);
      return current.map((project) =>
        project.id === id && !hasTag(project.tags, key)
          ? { ...project, tags: [...(project.tags ?? []), existing ?? tag] }
          : project,
      );
    });
  }

  function removeTag(id: string, name: string) {
    const key = tagKey(name);
    return changeProjects((current) =>
      current.map((project) =>
        project.id === id
          ? {
              ...project,
              tags: project.tags?.filter((tag) => tagKey(tag.name) !== key),
            }
          : project,
      ),
    );
  }

  function saveProject(details: ProjectDetails) {
    if (!draft) return false;

    if (draft !== 'new') {
      return changeProjects((current) =>
        current.map((project) =>
          project.id === draft.id ? { ...project, ...details } : project,
        ),
      );
    }

    const project = {
      ...details,
      id:
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    const saved = changeProjects((current) => [...current, project]);
    if (saved) {
      setActiveTag(undefined);
      selectProject(project.id);
    }
    return saved;
  }

  function togglePinnedProject(id: string) {
    return changeProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, pinned: !project.pinned } : project,
      ),
    );
  }

  function removeProject(id: string) {
    const removed = changeProjects((current) =>
      current.filter((project) => project.id !== id),
    );
    if (removed && selectedProjectId === id) selectProject();
    return removed;
  }

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
            projects={shownProjects}
            knownTags={projects.flatMap((project) => project.tags ?? [])}
            activeTag={activeTag}
            tagProjectId={tagProjectId}
            selectedProjectId={selectedProjectId}
            draft={draft}
            onToggle={() => setSidebarOverride(!collapsed)}
            onAddProject={startProject}
            onAddItem={(id) => startItem(id, projectActionsId(id))}
            onSaveProject={saveProject}
            onEditProject={(project) => {
              if (!tagProjectId) setDraft((current) => current ?? project);
            }}
            onCloseDraft={() => setDraft(undefined)}
            onStartTag={(id) => {
              if (!draft) setTagProjectId((current) => current ?? id);
            }}
            onCloseTag={() => setTagProjectId(undefined)}
            onSaveTag={addTag}
            onRemoveTag={removeTag}
            onToggleTag={(name) => {
              const key = tagKey(name);
              setActiveTag((current) => (current === key ? undefined : key));
              setTagProjectId(undefined);
            }}
            onTogglePinned={togglePinnedProject}
            onRemoveProject={removeProject}
            onSelectProject={(id) => {
              selectProject(id);
              if (compact) setSidebarOverride(true);
            }}
          />
          {(!compact || collapsed) && (
            <View style={styles.base.content}>
              <ProjectContent
                project={selectedProject}
                openBoardId={openBoardId}
                onOpenBoard={setOpenBoardId}
                hasProjects={projects.length > 0}
                addingProject={
                  draft !== undefined || tagProjectId !== undefined
                }
                theme={theme}
                fontsLoaded={fontsLoaded}
                onAddProject={startProject}
                onChangeEvents={(boardId, change) =>
                  !!selectedProject &&
                  changeCalendarEvents(selectedProject.id, boardId, change)
                }
                onAddItem={() => {
                  if (selectedProject)
                    startItem(selectedProject.id, 'add-project-item');
                }}
              />
            </View>
          )}
        </View>
        {itemDialog && itemProject && (
          <AddItemDialog
            key={itemDialog.projectId}
            projectTitle={itemProject.title}
            returnFocusId={itemDialog.returnFocusId}
            theme={theme}
            fontsLoaded={fontsLoaded}
            onSave={saveItem}
            onClose={() => setItemDialog(undefined)}
          />
        )}
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    </TamaguiProvider>
  );
}
