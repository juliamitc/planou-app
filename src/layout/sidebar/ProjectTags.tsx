import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'tamagui/button';

import { tagKey, type ProjectTag } from '../../projects/projectTags';
import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../../theme/colors';
import { tagStyles } from './ProjectTags.styles';
import { styles } from './ProjectsSidebar.styles';

type ProjectTagsProps = {
  tags: ProjectTag[];
  activeTag?: string;
  theme: LayoutTheme;
  fontsLoaded: boolean;
  disabled: boolean;
  onToggle: (name: string) => void;
  onRemove: (name: string) => boolean;
};

type TagChipProps = Omit<ProjectTagsProps, 'tags' | 'activeTag'> & {
  tag: ProjectTag;
  selected: boolean;
};

export function ProjectTags({ tags, activeTag, ...props }: ProjectTagsProps) {
  const [failed, setFailed] = useState(false);
  if (!tags.length) return null;

  return (
    <>
      <View style={tagStyles.list}>
        {tags.map((tag) => (
          <TagChip
            key={tagKey(tag.name)}
            tag={tag}
            selected={tagKey(tag.name) === activeTag}
            {...props}
            onRemove={(name) => {
              const removed = props.onRemove(name);
              setFailed(!removed);
              return removed;
            }}
          />
        ))}
      </View>
      {failed && (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.base.saveError, styles[props.theme].danger]}
        >
          Couldn’t remove this tag. Try again.
        </Text>
      )}
    </>
  );
}

function TagChip({
  tag,
  theme,
  fontsLoaded,
  selected,
  disabled,
  onToggle,
  onRemove,
}: TagChipProps) {
  const [hovered, setHovered] = useState(false);
  const [removeFocused, setRemoveFocused] = useState(false);
  const colors = layoutColors[theme];
  const focusStyles = buttonFocusStyles(theme);

  return (
    <View
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={[
        tagStyles.chip,
        {
          backgroundColor: `${tag.color}${selected ? '44' : '24'}`,
          borderColor: selected ? colors.selectionInk : `${tag.color}4D`,
        },
      ]}
    >
      <Button
        size="sm"
        variant="quiet"
        style={tagStyles.labelButton}
        aria-label={`Filter by ${tag.name}`}
        aria-pressed={selected}
        disabled={disabled}
        {...focusStyles}
        onPress={() => onToggle(tag.name)}
      >
        <View style={[tagStyles.dot, { backgroundColor: tag.color }]} />
        <Text
          numberOfLines={1}
          style={[
            tagStyles.label,
            styles[theme].text,
            fontsLoaded && styles.base.bodyFont,
          ]}
        >
          {tag.name}
        </Text>
      </Button>
      <Button
        size="sm"
        variant="quiet"
        style={tagStyles.removeButton}
        aria-label={`Remove tag ${tag.name}`}
        disabled={disabled}
        opacity={hovered || removeFocused ? 1 : 0}
        onFocus={() => setRemoveFocused(true)}
        onBlur={() => setRemoveFocused(false)}
        {...focusStyles}
        onPress={() => onRemove(tag.name)}
      >
        <X size={12} color={colors.muted} />
      </Button>
    </View>
  );
}
