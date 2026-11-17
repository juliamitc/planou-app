import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'tamagui/button';

import { tagColors, tagKey, type ProjectTag } from '../../projects/projectTags';
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
  rowBackground: string;
  fontsLoaded: boolean;
  disabled: boolean;
  onToggle: (name: string) => void;
  onRemove: (name: string) => boolean;
};

type TagChipProps = Omit<ProjectTagsProps, 'tags' | 'activeTag'> & {
  tag: ProjectTag;
  selected: boolean;
};

function colorChannels(hex: string) {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
}

function tagColor(color: string, surface: string) {
  const isPreset = tagColors.some(
    (preset) => preset.value === color.toUpperCase(),
  );
  const colorWeight = isPreset ? 0.9 : 0.62;
  const base = colorChannels(color);
  const surfaceChannels = colorChannels(surface);
  const fill = base.map((channel, index) =>
    Math.round(
      channel * colorWeight + surfaceChannels[index] * (1 - colorWeight),
    ),
  );
  const [red, green, blue] = fill.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  const brightestChannel = Math.max(...base);
  const outlinePeak = Math.max(...fill) * 0.82;
  const outline = base.map((channel) =>
    Math.max(0, Math.round(outlinePeak - (brightestChannel - channel) * 1.85)),
  );
  return {
    fill: `rgb(${fill.join(', ')})`,
    outline: `rgb(${outline.join(', ')})`,
    text: luminance > 0.179 ? '#000000' : '#ffffff',
  };
}

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
  rowBackground,
  fontsLoaded,
  selected,
  disabled,
  onToggle,
  onRemove,
}: TagChipProps) {
  const [hovered, setHovered] = useState(false);
  const [removeFocused, setRemoveFocused] = useState(false);
  const colors = tagColor(tag.color, layoutColors[theme].sidebar);
  const focusStyles = buttonFocusStyles(theme);

  return (
    <View
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={tagStyles.chip}
    >
      {selected && (
        <>
          <View
            pointerEvents="none"
            style={[tagStyles.tagEdge, { borderRightColor: colors.outline }]}
          />
          <View
            pointerEvents="none"
            style={[tagStyles.tagBody, { backgroundColor: colors.outline }]}
          />
        </>
      )}
      <View
        pointerEvents="none"
        style={[
          tagStyles.tagEdge,
          selected && tagStyles.outlinedEdge,
          { borderRightColor: colors.fill },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          tagStyles.tagBody,
          selected && tagStyles.outlinedBody,
          { backgroundColor: colors.fill },
        ]}
      />
      <View
        pointerEvents="none"
        style={[tagStyles.tagHole, { backgroundColor: rowBackground }]}
      />
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
        <Text
          numberOfLines={1}
          style={[
            tagStyles.label,
            { color: colors.text },
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
        <X size={10} color={colors.text} />
      </Button>
    </View>
  );
}
