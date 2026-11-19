import { ChevronRight, Plus } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { Button } from 'tamagui/button';

import { CalendarBoard } from '../projects/calendar/CalendarBoard';
import type { CalendarEvent } from '../projects/calendar/calendarEvents';
import { projectIcons } from '../projects/projectIcons';
import { boardFormats, itemTypes } from '../projects/projectItems';
import type { Project } from '../projects/projects';
import { buttonFocusStyles, clay, type LayoutTheme } from '../theme/colors';
import { styles } from './AppLayout.styles';

type ProjectContentProps = {
  project?: Project;
  openBoardId?: string;
  hasProjects: boolean;
  addingProject: boolean;
  theme: LayoutTheme;
  fontsLoaded: boolean;
  onAddProject: () => void;
  onAddItem: () => void;
  onOpenBoard: (id?: string) => void;
  onChangeEvents: (
    boardId: string,
    change: (events: CalendarEvent[]) => CalendarEvent[],
  ) => boolean;
};

export function ProjectContent({
  project,
  openBoardId,
  hasProjects,
  addingProject,
  theme,
  fontsLoaded,
  onAddProject,
  onAddItem,
  onOpenBoard,
  onChangeEvents,
}: ProjectContentProps) {
  const appearance = styles[theme];
  const headingStyle = [
    styles.base.pageTitle,
    appearance.label,
    fontsLoaded && styles.base.headingFont,
  ];

  if (project) {
    const { Icon } = projectIcons[project.icon];
    const calendar = project.items?.find(
      (item) => item.id === openBoardId && item.boardFormat === 'calendar',
    );

    if (calendar) {
      return (
        <CalendarBoard
          key={calendar.id}
          board={calendar}
          projectTitle={project.title}
          theme={theme}
          fontsLoaded={fontsLoaded}
          onBack={() => onOpenBoard()}
          onChangeEvents={(change) => onChangeEvents(calendar.id, change)}
        />
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.base.projectOverview}>
        <View style={styles.base.projectHeading}>
          <Icon size={26} strokeWidth={1.7} color={clay} />
          <Text accessibilityRole="header" style={headingStyle}>
            {project.title}
          </Text>
        </View>
        <Button
          id="add-project-item"
          size="sm"
          variant="outlined"
          disabled={addingProject}
          {...buttonFocusStyles(theme)}
          onPress={onAddItem}
          style={[styles.base.addItemButton, appearance.newProjectButton]}
        >
          <Plus size={16} color={clay} />
          <Text
            style={[
              appearance.newProjectLabel,
              fontsLoaded && styles.base.headingFont,
            ]}
          >
            Add item
          </Text>
        </Button>
        {project.items?.length ? (
          <View style={styles.base.itemList}>
            {project.items.map((item) => {
              const { Icon: ItemIcon } = itemTypes[item.type];
              const label = item.boardFormat
                ? boardFormats[item.boardFormat]
                : itemTypes[item.type].label;
              const row = (
                <>
                  <ItemIcon size={20} strokeWidth={1.7} color={clay} />
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.base.itemTitle,
                      appearance.label,
                      fontsLoaded && styles.base.optionFont,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.base.itemType,
                      appearance.muted,
                      fontsLoaded && styles.base.optionFont,
                    ]}
                  >
                    {label}
                  </Text>
                </>
              );
              return item.boardFormat === 'calendar' ? (
                <Button
                  key={item.id}
                  size="sm"
                  variant="quiet"
                  aria-label={`Open calendar ${item.title}`}
                  style={[styles.base.itemRow, appearance.itemRow]}
                  {...buttonFocusStyles(theme)}
                  onPress={() => onOpenBoard(item.id)}
                >
                  {row}
                  <ChevronRight size={16} color={clay} />
                </Button>
              ) : (
                <View
                  key={item.id}
                  style={[styles.base.itemRow, appearance.itemRow]}
                >
                  {row}
                </View>
              );
            })}
          </View>
        ) : (
          <Text
            style={[
              styles.base.pageCopy,
              appearance.muted,
              fontsLoaded && styles.base.optionFont,
            ]}
          >
            This project is empty.
          </Text>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={styles.base.emptyProjects}>
      <Text accessibilityRole="header" style={headingStyle}>
        {hasProjects ? 'Choose a project' : 'Create your first project'}
      </Text>
      <Button
        size="sm"
        variant="outlined"
        style={[styles.base.newProjectButton, appearance.newProjectButton]}
        {...buttonFocusStyles(theme)}
        disabled={addingProject}
        onPress={onAddProject}
      >
        <Text
          style={[
            appearance.newProjectLabel,
            fontsLoaded && styles.base.headingFont,
          ]}
        >
          New project
        </Text>
      </Button>
    </View>
  );
}
