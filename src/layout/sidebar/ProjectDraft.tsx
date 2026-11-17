import { ChevronDown, Trash2, X } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'tamagui/button';

import { projectIcons, type ProjectIcon } from '../../projects/projectIcons';
import type { ProjectDetails } from '../../projects/projects';
import {
  buttonFocusStyles,
  clay,
  layoutColors,
  type LayoutTheme,
} from '../../theme/colors';
import { styles } from './ProjectsSidebar.styles';
import { useInlineDraft } from './useInlineDraft';

type ProjectDraftProps = {
  theme: LayoutTheme;
  fontsLoaded: boolean;
  active: boolean;
  initialDetails?: ProjectDetails;
  onSave: (details: ProjectDetails) => boolean;
  onClose: () => void;
  onRestoreFocus: () => void;
};

const iconOptions = Object.keys(projectIcons) as ProjectIcon[];

export function ProjectDraft({
  theme,
  fontsLoaded,
  active,
  initialDetails,
  onSave,
  onClose,
  onRestoreFocus,
}: ProjectDraftProps) {
  const [title, setTitle] = useState(initialDetails?.title ?? '');
  const [nameFocused, setNameFocused] = useState(false);
  const [icon, setIcon] = useState<ProjectIcon>(
    initialDetails?.icon ?? 'folder',
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const input = useRef<TextInput>(null);
  const finished = useRef(false);
  const appearance = styles[theme];
  const colors = layoutColors[theme];
  const focusStyles = buttonFocusStyles(theme);
  const { Icon, label } = projectIcons[icon];

  const finish = useCallback(
    (restoreFocus = false) => {
      if (finished.current) return;

      const projectTitle = title.trim();
      if (projectTitle && !onSave({ title: projectTitle, icon })) {
        setSaveFailed(true);
        return;
      }

      finished.current = true;
      onClose();
      if (restoreFocus) onRestoreFocus();
    },
    [icon, onClose, onRestoreFocus, onSave, title],
  );

  const discard = useCallback(() => {
    finished.current = true;
    onClose();
    onRestoreFocus();
  }, [onClose, onRestoreFocus]);

  const draftId = useInlineDraft(active, finish, () => {
    if (pickerOpen) {
      setPickerOpen(false);
      input.current?.focus();
    } else {
      discard();
    }
  });

  return (
    <View nativeID={draftId} style={styles.base.draft}>
      <View
        style={[
          styles.base.draftRow,
          appearance.draftRow,
          nameFocused && appearance.draftFocused,
        ]}
      >
        <Button
          size="sm"
          variant="quiet"
          style={styles.base.iconPicker}
          aria-label={`Choose project icon, current: ${label}`}
          aria-expanded={pickerOpen}
          {...focusStyles}
          onPress={() => setPickerOpen(!pickerOpen)}
        >
          <Icon size={17} strokeWidth={1.8} color={clay} />
          <ChevronDown size={11} color={colors.muted} />
        </Button>
        <TextInput
          ref={input}
          autoFocus
          value={title}
          onChangeText={setTitle}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          onSubmitEditing={() => finish(true)}
          submitBehavior="submit"
          accessibilityLabel="Project name"
          placeholder="Project name"
          placeholderTextColor={colors.muted}
          spellCheck={false}
          style={[
            styles.base.draftInput,
            appearance.text,
            fontsLoaded && styles.base.bodyFont,
          ]}
        />
        <Button
          size="sm"
          variant="quiet"
          style={styles.base.draftButton}
          aria-label={
            initialDetails ? 'Discard changes' : 'Discard new project'
          }
          {...focusStyles}
          onPress={discard}
        >
          {initialDetails ? (
            <X size={15} strokeWidth={1.7} color={colors.muted} />
          ) : (
            <Trash2 size={15} strokeWidth={1.7} color={colors.muted} />
          )}
        </Button>
      </View>
      {pickerOpen && (
        <View style={[styles.base.iconMenu, appearance.iconMenu]}>
          {iconOptions.map((option) => {
            const { Icon: OptionIcon, label: optionLabel } =
              projectIcons[option];

            return (
              <Button
                key={option}
                size="sm"
                variant="quiet"
                style={[
                  styles.base.draftButton,
                  icon === option && appearance.selectedRow,
                ]}
                aria-label={optionLabel}
                aria-pressed={icon === option}
                {...focusStyles}
                onPress={() => {
                  setIcon(option);
                  setPickerOpen(false);
                  input.current?.focus();
                }}
              >
                <OptionIcon
                  size={17}
                  strokeWidth={1.7}
                  color={icon === option ? colors.selectionInk : colors.muted}
                />
              </Button>
            );
          })}
        </View>
      )}
      {saveFailed && (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.base.saveError, appearance.text]}
        >
          Couldn’t save this project on this device. Try again with Enter.
        </Text>
      )}
    </View>
  );
}
