import { Text, View } from 'react-native';
import { Button } from 'tamagui/button';

import { projectIcons } from '../projects/projectIcons';
import type { Project } from '../projects/projects';
import { buttonFocusStyles, clay, type LayoutTheme } from '../theme/colors';
import { styles } from './AppLayout.styles';

type ProjectContentProps = {
  project?: Project;
  hasProjects: boolean;
  addingProject: boolean;
  theme: LayoutTheme;
  fontsLoaded: boolean;
  onAddProject: () => void;
};

export function ProjectContent({
  project,
  hasProjects,
  addingProject,
  theme,
  fontsLoaded,
  onAddProject,
}: ProjectContentProps) {
  const appearance = styles[theme];
  const headingStyle = [
    styles.base.pageTitle,
    appearance.label,
    fontsLoaded && styles.base.headingFont,
  ];

  if (project) {
    const { Icon } = projectIcons[project.icon];

    return (
      <View style={styles.base.projectOverview}>
        <View style={styles.base.projectHeading}>
          <Icon size={26} strokeWidth={1.7} color={clay} />
          <Text accessibilityRole="header" style={headingStyle}>
            {project.title}
          </Text>
        </View>
        <Text
          style={[
            styles.base.pageCopy,
            appearance.muted,
            fontsLoaded && styles.base.optionFont,
          ]}
        >
          This project is empty.
        </Text>
      </View>
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
