import { Check, ChevronDown, Plus, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { Button } from 'tamagui/button';

import {
  colorForHue,
  isTagColor,
  tagColors,
  tagKey,
  type ProjectTag,
} from '../../projects/projectTags';
import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../../theme/colors';
import { hueStyle, tagStyles } from './ProjectTags.styles';
import { styles } from './ProjectsSidebar.styles';
import { useInlineDraft } from './useInlineDraft';

type TagDraftProps = {
  theme: LayoutTheme;
  active: boolean;
  projectTags: ProjectTag[];
  knownTags: ProjectTag[];
  onSave: (tag: ProjectTag) => boolean;
  onClose: () => void;
  onRestoreFocus: () => void;
};

export function TagDraft({
  theme,
  active,
  projectTags,
  knownTags,
  onSave,
  onClose,
  onRestoreFocus,
}: TagDraftProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(tagColors[0].value);
  const [hue, setHue] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [error, setError] = useState('');
  const finished = useRef(false);
  const input = useRef<TextInput>(null);
  const colors = layoutColors[theme];
  const appearance = styles[theme];
  const focusStyles = buttonFocusStyles(theme);
  const key = tagKey(name);
  const existingTag = knownTags.find((tag) => tagKey(tag.name) === key);
  const pickedColor = existingTag?.color ?? color;

  function close(restoreFocus: boolean) {
    finished.current = true;
    onClose();
    if (restoreFocus) onRestoreFocus();
  }

  function finish(restoreFocus = false) {
    if (finished.current) return;
    if (!key) {
      close(restoreFocus);
      return;
    }
    if (projectTags.some((tag) => tagKey(tag.name) === key)) {
      setError('This project already has that tag.');
      return;
    }
    if (!isTagColor(pickedColor)) {
      setError('Enter a hex color like #7CAF90.');
      return;
    }
    if (
      !onSave({
        name: existingTag?.name ?? name.trim(),
        color: pickedColor.toUpperCase(),
      })
    ) {
      setError('Couldn’t save this tag. Try again.');
      return;
    }
    close(restoreFocus);
  }

  const draftId = useInlineDraft(active, finish, () => {
    if (pickerOpen) {
      setPickerOpen(false);
      input.current?.focus();
    } else {
      close(true);
    }
  });

  return (
    <View nativeID={draftId} style={styles.base.draft}>
      <View style={[styles.base.draftRow, appearance.draftRow]}>
        <Button
          size="sm"
          variant="quiet"
          style={styles.base.iconPicker}
          aria-label="Choose tag color"
          aria-expanded={pickerOpen && !existingTag}
          disabled={!!existingTag}
          {...focusStyles}
          onPress={() => setPickerOpen(!pickerOpen)}
        >
          <View
            style={[
              tagStyles.colorDot,
              {
                backgroundColor: isTagColor(pickedColor)
                  ? pickedColor
                  : colors.surface,
                borderColor: colors.border,
              },
            ]}
          />
          <ChevronDown size={11} color={colors.muted} />
        </Button>
        <TextInput
          ref={input}
          autoFocus
          value={name}
          accessibilityLabel="Tag name"
          placeholder="Tag name"
          placeholderTextColor={colors.muted}
          submitBehavior="submit"
          onChangeText={(value) => {
            setName(value);
            setError('');
          }}
          onSubmitEditing={() => finish(true)}
          style={[styles.base.draftInput, appearance.text]}
        />
        <Button
          size="sm"
          variant="quiet"
          style={styles.base.draftButton}
          aria-label="Save tag"
          disabled={!key}
          {...focusStyles}
          onPress={() => finish(true)}
        >
          <Check size={15} color={colors.selectionInk} />
        </Button>
        <Button
          size="sm"
          variant="quiet"
          style={styles.base.draftButton}
          aria-label="Discard tag"
          {...focusStyles}
          onPress={() => close(true)}
        >
          <X size={15} color={colors.muted} />
        </Button>
      </View>
      {pickerOpen && !existingTag && (
        <View style={[tagStyles.colorMenu, appearance.iconMenu]}>
          <View style={tagStyles.palette}>
            {tagColors.map((preset) => (
              <Button
                key={preset.name}
                size="sm"
                variant="quiet"
                style={tagStyles.swatch}
                aria-label={preset.name}
                aria-pressed={color === preset.value}
                {...focusStyles}
                onPress={() => {
                  setColor(preset.value);
                  setError('');
                  setCustomOpen(false);
                }}
              >
                <View
                  style={[
                    tagStyles.colorDot,
                    {
                      backgroundColor: preset.value,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {color === preset.value && (
                    <Check size={11} color="#242424" />
                  )}
                </View>
              </Button>
            ))}
            <Button
              size="sm"
              variant="quiet"
              style={tagStyles.swatch}
              aria-label="Custom color"
              aria-expanded={customOpen}
              {...focusStyles}
              onPress={() => setCustomOpen(!customOpen)}
            >
              <Plus size={15} color={colors.selectionInk} />
            </Button>
          </View>
          {customOpen && (
            <View style={tagStyles.custom}>
              {Platform.OS === 'web' && (
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={hue}
                  aria-label="Color hue"
                  style={hueStyle}
                  onChange={(event) => {
                    const nextHue = Number(event.currentTarget.value);
                    setHue(nextHue);
                    setColor(colorForHue(nextHue));
                    setError('');
                  }}
                />
              )}
              <TextInput
                accessibilityLabel="Hex color"
                value={color}
                placeholder="#7CAF90"
                maxLength={7}
                autoCapitalize="characters"
                submitBehavior="submit"
                onChangeText={(value) => {
                  setColor(value);
                  setError('');
                }}
                onSubmitEditing={() => finish(true)}
                style={[
                  tagStyles.hexInput,
                  appearance.draftRow,
                  appearance.text,
                ]}
              />
            </View>
          )}
        </View>
      )}
      {!!error && (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.base.saveError, appearance.danger]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
