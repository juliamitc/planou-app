import {
  Ellipsis,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Tag,
  Trash2,
} from 'lucide-react-native';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'tamagui/button';
import { Popover } from 'tamagui/popover';

import { projectIcons } from '../../projects/projectIcons';
import type { Project } from '../../projects/projects';
import {
  buttonFocusStyles,
  clay,
  layoutColors,
  type LayoutTheme,
} from '../../theme/colors';
import { styles } from './ProjectsSidebar.styles';

type ProjectRowProps = {
  project: Project;
  theme: LayoutTheme;
  fontsLoaded: boolean;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onAddTag: () => void;
  onTogglePinned: () => boolean;
  onRemove: () => boolean;
};

export function projectActionsId(projectId: string) {
  return `project-actions-${projectId}`;
}

export function ProjectRow({
  project,
  theme,
  fontsLoaded,
  selected,
  disabled,
  onSelect,
  onEdit,
  onAddTag,
  onTogglePinned,
  onRemove,
}: ProjectRowProps) {
  const [hovered, setHovered] = useState(false);
  const [actionsFocused, setActionsFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const cancelRemoveButton = useRef<ComponentRef<typeof Button>>(null);
  const openingTag = useRef(false);
  const { Icon } = projectIcons[project.icon];
  const colors = layoutColors[theme];
  const appearance = styles[theme];
  const focusStyles = buttonFocusStyles(theme);
  const labelStyle = [appearance.text, fontsLoaded && styles.base.bodyFont];

  useEffect(() => {
    if (confirmRemove) cancelRemoveButton.current?.focus();
  }, [confirmRemove]);

  const actions = [
    {
      label: project.pinned ? 'Unpin project' : 'Pin project',
      Icon: project.pinned ? PinOff : Pin,
      onPress: () => {
        if (onTogglePinned()) setMenuOpen(false);
        else setSaveFailed(true);
      },
    },
    { label: 'Add item', Icon: Plus },
    {
      label: 'Add tag',
      Icon: Tag,
      onPress: () => {
        openingTag.current = true;
        setMenuOpen(false);
        onAddTag();
      },
    },
    {
      label: 'Edit project',
      Icon: Pencil,
      onPress: () => {
        setMenuOpen(false);
        onEdit();
      },
    },
  ];

  return (
    <View
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={[styles.base.projectRow, selected && appearance.selectedRow]}
    >
      <Button
        size="sm"
        variant="quiet"
        disabled={disabled}
        aria-current={selected ? 'true' : undefined}
        style={styles.base.projectLink}
        {...focusStyles}
        onPress={onSelect}
      >
        <Icon size={17} strokeWidth={1.7} color={clay} />
        <Text numberOfLines={1} style={[styles.base.projectName, labelStyle]}>
          {project.title}
        </Text>
      </Button>
      {project.pinned && (
        <Pin size={12} color={colors.selectionInk} aria-hidden />
      )}
      <Popover
        placement="bottom-end"
        offset={6}
        open={menuOpen && !disabled}
        onOpenChange={(open) => {
          if (open) openingTag.current = false;
          setConfirmRemove(false);
          setSaveFailed(false);
          setMenuOpen(open);
        }}
      >
        <Popover.Trigger asChild>
          <Button
            id={projectActionsId(project.id)}
            aria-label={`Actions for ${project.title}`}
            disabled={disabled}
            size="sm"
            variant="quiet"
            opacity={hovered || actionsFocused || menuOpen ? 1 : 0}
            onFocus={() => setActionsFocused(true)}
            onBlur={() => setActionsFocused(false)}
            style={styles.base.draftButton}
            {...focusStyles}
          >
            <Ellipsis size={17} color={colors.muted} />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          onCloseAutoFocus={(event) => {
            if (openingTag.current) event.cancel();
          }}
          style={[styles.base.actionMenu, appearance.iconMenu]}
        >
          {confirmRemove ? (
            <View style={styles.base.confirmRemove}>
              <Text style={labelStyle}>Remove this project?</Text>
              <View style={styles.base.confirmButtons}>
                <Button
                  ref={cancelRemoveButton}
                  size="sm"
                  variant="quiet"
                  {...focusStyles}
                  onPress={() => {
                    setSaveFailed(false);
                    setMenuOpen(false);
                    setConfirmRemove(false);
                  }}
                >
                  <Text style={labelStyle}>Cancel</Text>
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  {...focusStyles}
                  onPress={() => {
                    if (!onRemove()) setSaveFailed(true);
                  }}
                >
                  <Text style={[labelStyle, appearance.danger]}>Remove</Text>
                </Button>
              </View>
            </View>
          ) : (
            <>
              {actions.map(({ label, Icon: ActionIcon, onPress }) => (
                <Button
                  key={label}
                  size="sm"
                  variant="quiet"
                  disabled={!onPress}
                  style={[
                    styles.base.action,
                    !onPress && styles.base.unavailableAction,
                  ]}
                  {...focusStyles}
                  onPress={onPress}
                >
                  <ActionIcon size={16} color={colors.muted} />
                  <Text style={labelStyle}>{label}</Text>
                </Button>
              ))}
              <View
                style={[styles.base.actionDivider, appearance.actionDivider]}
              />
              <Button
                size="sm"
                variant="quiet"
                style={styles.base.action}
                {...focusStyles}
                onPress={() => {
                  setSaveFailed(false);
                  setConfirmRemove(true);
                }}
              >
                <Trash2 size={16} color={appearance.danger.color} />
                <Text style={[labelStyle, appearance.danger]}>
                  Remove project
                </Text>
              </Button>
            </>
          )}
          {saveFailed && (
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.base.saveError, appearance.danger]}
            >
              Couldn’t save changes. Try again.
            </Text>
          )}
        </Popover.Content>
      </Popover>
    </View>
  );
}
