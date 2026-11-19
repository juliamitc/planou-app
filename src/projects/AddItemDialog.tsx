import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from 'tamagui/button';
import { Dialog } from 'tamagui/dialog';

import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../theme/colors';
import { styles } from './AddItemDialog.styles';
import {
  boardFormats,
  itemTypes,
  type BoardFormat,
  type ItemDetails,
  type ItemType,
} from './projectItems';

type AddItemDialogProps = {
  projectTitle: string;
  returnFocusId: string;
  theme: LayoutTheme;
  fontsLoaded: boolean;
  onSave: (details: ItemDetails) => boolean;
  onClose: () => void;
};

const options = Object.keys(itemTypes) as ItemType[];
const formats = Object.keys(boardFormats) as BoardFormat[];

export function AddItemDialog({
  projectTitle,
  returnFocusId,
  theme,
  fontsLoaded,
  onSave,
  onClose,
}: AddItemDialogProps) {
  const [type, setType] = useState<ItemType>();
  const [boardFormat, setBoardFormat] = useState<BoardFormat>();
  const [title, setTitle] = useState('');
  const [saveFailed, setSaveFailed] = useState(false);
  const saved = useRef(false);
  const input = useRef<TextInput>(null);
  const colors = layoutColors[theme];
  const appearance = styles[theme];
  const focusStyles = buttonFocusStyles(theme);
  const bodyFont = fontsLoaded && styles.base.bodyFont;
  const headingFont = fontsLoaded && styles.base.headingFont;
  const canSave =
    !!type && !!title.trim() && (type !== 'board' || !!boardFormat);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }

    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, [onClose]);

  function save() {
    if (!type || !canSave || saved.current) return;
    const details = { title: title.trim(), type };
    if (!onSave(type === 'board' ? { ...details, boardFormat } : details)) {
      setSaveFailed(true);
      return;
    }
    saved.current = true;
    onClose();
  }

  return (
    <Dialog
      open
      modal
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay style={styles.base.overlay} />
        <Dialog.Content
          style={[styles.base.content, appearance.content]}
          onOpenAutoFocus={(event) => {
            event.cancel();
            input.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.cancel();
            if (typeof document !== 'undefined') {
              document.getElementById(returnFocusId)?.focus();
            }
          }}
        >
          <View style={styles.base.header}>
            <View style={styles.base.heading}>
              <Dialog.Title asChild>
                <Text style={[styles.base.title, appearance.text, headingFont]}>
                  Add item
                </Text>
              </Dialog.Title>
              <Dialog.Description asChild>
                <Text
                  style={[styles.base.subtitle, appearance.muted, bodyFont]}
                  numberOfLines={2}
                >
                  {projectTitle}
                </Text>
              </Dialog.Description>
            </View>
            <Button
              size="sm"
              variant="quiet"
              aria-label="Close add item"
              style={styles.base.close}
              {...focusStyles}
              onPress={onClose}
            >
              <X size={18} color={colors.muted} />
            </Button>
          </View>
          <ScrollView contentContainerStyle={styles.base.body}>
            <View style={styles.base.field}>
              <Text style={[styles.base.label, appearance.text, headingFont]}>
                Name
              </Text>
              <TextInput
                ref={input}
                value={title}
                accessibilityLabel="Item name"
                placeholder="Give your item a name"
                placeholderTextColor={colors.muted}
                style={[styles.base.input, appearance.input, bodyFont]}
                submitBehavior="submit"
                onChangeText={(value) => {
                  setTitle(value);
                  setSaveFailed(false);
                }}
                onSubmitEditing={save}
              />
            </View>
            <View style={styles.base.field}>
              <Text style={[styles.base.label, appearance.text, headingFont]}>
                Type
              </Text>
              <View
                role="group"
                accessibilityLabel="Item type"
                style={styles.base.options}
              >
                {options.map((value) => {
                  const { Icon, label, description } = itemTypes[value];
                  const selected = type === value;
                  return (
                    <View key={value} style={styles.base.optionCell}>
                      <Button
                        size="sm"
                        variant="quiet"
                        aria-label={label}
                        aria-pressed={selected}
                        style={[
                          styles.base.option,
                          appearance.option,
                          selected && appearance.selected,
                        ]}
                        {...focusStyles}
                        onPress={() => {
                          setType(value);
                          setSaveFailed(false);
                        }}
                      >
                        <View
                          aria-hidden
                          style={[
                            styles.base.optionIcon,
                            appearance.optionIcon,
                            selected && appearance.selectedIcon,
                          ]}
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.8}
                            color={
                              selected ? colors.sidebar : colors.selectionInk
                            }
                          />
                        </View>
                        <View style={styles.base.optionCopy}>
                          <Text
                            style={[
                              styles.base.optionTitle,
                              appearance.text,
                              headingFont,
                            ]}
                          >
                            {label}
                          </Text>
                          <Text
                            style={[
                              styles.base.description,
                              appearance.muted,
                              bodyFont,
                            ]}
                          >
                            {description}
                          </Text>
                        </View>
                      </Button>
                    </View>
                  );
                })}
              </View>
            </View>
            {type === 'board' && (
              <View style={styles.base.field}>
                <Text style={[styles.base.label, appearance.text, headingFont]}>
                  Board format
                </Text>
                <View
                  role="group"
                  accessibilityLabel="Board format"
                  style={styles.base.formats}
                >
                  {formats.map((format) => (
                    <Button
                      key={format}
                      size="sm"
                      variant="outlined"
                      aria-pressed={boardFormat === format}
                      style={[
                        styles.base.format,
                        appearance.option,
                        boardFormat === format && appearance.selected,
                      ]}
                      {...focusStyles}
                      onPress={() => {
                        setBoardFormat(format);
                        setSaveFailed(false);
                      }}
                    >
                      <Text style={[appearance.text, headingFont]}>
                        {boardFormats[format]}
                      </Text>
                    </Button>
                  ))}
                </View>
              </View>
            )}
            {saveFailed && (
              <Text
                accessibilityLiveRegion="polite"
                style={[styles.base.error, appearance.error, bodyFont]}
              >
                Couldn’t save this item. Your changes are still here. Try again.
              </Text>
            )}
          </ScrollView>
          <View style={[styles.base.footer, appearance.footer]}>
            <Button
              size="sm"
              variant="quiet"
              style={styles.base.footerButton}
              {...focusStyles}
              onPress={onClose}
            >
              <Text style={[appearance.text, headingFont]}>Cancel</Text>
            </Button>
            <Button
              size="sm"
              variant="outlined"
              disabled={!canSave}
              style={[styles.base.footerButton, styles.base.saveButton]}
              {...focusStyles}
              onPress={save}
            >
              <Text style={[styles.base.saveText, headingFont]}>Save</Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
