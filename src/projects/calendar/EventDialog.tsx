import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from 'tamagui/button';
import { Dialog } from 'tamagui/dialog';

import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../../theme/colors';
import { styles as dialogStyles } from '../AddItemDialog.styles';
import { dateInputStyle, styles } from './CalendarBoard.styles';
import {
  isEventDate,
  isEventTime,
  type CalendarEvent,
  type EventDetails,
} from './calendarEvents';

type EventDialogProps = {
  event?: CalendarEvent;
  date: string;
  returnFocusId: string;
  theme: LayoutTheme;
  fontsLoaded: boolean;
  onSave: (details: EventDetails) => boolean;
  onDelete: () => boolean;
  onClose: () => void;
};

export function EventDialog({
  event,
  date,
  returnFocusId,
  theme,
  fontsLoaded,
  onSave,
  onDelete,
  onClose,
}: EventDialogProps) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [eventDate, setEventDate] = useState(date);
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [startTime, setStartTime] = useState(event?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(event?.endTime ?? '');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const input = useRef<TextInput>(null);
  const colors = layoutColors[theme];
  const appearance = dialogStyles[theme];
  const base = dialogStyles.base;
  const bodyFont = fontsLoaded && base.bodyFont;
  const headingFont = fontsLoaded && base.headingFont;
  const labelStyle = [base.label, appearance.text, headingFont];
  const focusStyles = buttonFocusStyles(theme);

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
    if (!title.trim() || confirmDelete) return;
    if (!isEventDate(eventDate)) {
      setError('Choose a valid date.');
      return;
    }
    if (
      !allDay &&
      (!isEventTime(startTime) || (endTime && !isEventTime(endTime)))
    ) {
      setError('Enter a start time and a valid end time if needed.');
      return;
    }
    if (!allDay && endTime && endTime <= startTime) {
      setError('End time must be after the start time.');
      return;
    }
    const details = { title: title.trim(), date: eventDate, allDay };
    const saved = onSave(
      allDay
        ? details
        : { ...details, startTime, endTime: endTime || undefined },
    );
    if (saved) onClose();
    else setError('Couldn’t save this event. Try again.');
  }

  function dateField(
    label: string,
    type: 'date' | 'time',
    value: string,
    onChange: (value: string) => void,
  ) {
    return (
      <View style={styles.base.formField}>
        <Text style={labelStyle}>{label}</Text>
        {Platform.OS === 'web' ? (
          <input
            aria-label={label}
            type={type}
            value={value}
            style={dateInputStyle(theme)}
            onChange={(event) => onChange(event.currentTarget.value)}
          />
        ) : (
          <TextInput
            accessibilityLabel={label}
            value={value}
            onChangeText={onChange}
            placeholder={type === 'date' ? 'YYYY-MM-DD' : 'HH:MM'}
            style={[base.input, appearance.input, bodyFont]}
          />
        )}
      </View>
    );
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
        <Dialog.Overlay style={base.overlay} />
        <Dialog.Content
          style={[base.content, appearance.content]}
          onOpenAutoFocus={(event) => {
            event.cancel();
            input.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.cancel();
            if (typeof document !== 'undefined') {
              (
                document.getElementById(returnFocusId) ??
                document.getElementById('new-calendar-event')
              )?.focus();
            }
          }}
        >
          <View style={base.header}>
            <View style={base.heading}>
              <Dialog.Title asChild>
                <Text style={[base.title, appearance.text, headingFont]}>
                  {event ? 'Edit event' : 'New event'}
                </Text>
              </Dialog.Title>
            </View>
          </View>
          <ScrollView contentContainerStyle={base.body}>
            {confirmDelete ? (
              <Text style={[base.subtitle, appearance.text, bodyFont]}>
                Delete “{event?.title}” from this calendar?
              </Text>
            ) : (
              <>
                <View style={base.field}>
                  <Text style={labelStyle}>Name</Text>
                  <TextInput
                    ref={input}
                    value={title}
                    onChangeText={setTitle}
                    accessibilityLabel="Event name"
                    placeholder="Give your event a name"
                    placeholderTextColor={colors.muted}
                    style={[base.input, appearance.input, bodyFont]}
                    onSubmitEditing={save}
                    submitBehavior="submit"
                  />
                </View>
                {dateField('Date', 'date', eventDate, setEventDate)}
                <View style={styles.base.formRow}>
                  <Switch
                    accessibilityLabel="All day"
                    value={allDay}
                    onValueChange={setAllDay}
                    trackColor={{
                      false: colors.border,
                      true: colors.selectionInk,
                    }}
                  />
                  <Text style={labelStyle}>All day</Text>
                </View>
                {!allDay && (
                  <View style={styles.base.formRow}>
                    {dateField('Start time', 'time', startTime, setStartTime)}
                    {dateField(
                      'End time (optional)',
                      'time',
                      endTime,
                      setEndTime,
                    )}
                  </View>
                )}
              </>
            )}
            {!!error && (
              <Text
                accessibilityLiveRegion="polite"
                style={[base.error, appearance.error, bodyFont]}
              >
                {error}
              </Text>
            )}
          </ScrollView>
          <View style={[base.footer, appearance.footer]}>
            {event && !confirmDelete && (
              <Button
                size="sm"
                variant="quiet"
                style={[base.footerButton, styles.base.deleteButton]}
                {...focusStyles}
                onPress={() => {
                  setError('');
                  setConfirmDelete(true);
                }}
              >
                <Text style={[appearance.error, headingFont]}>Delete</Text>
              </Button>
            )}
            <Button
              size="sm"
              variant="quiet"
              style={base.footerButton}
              {...focusStyles}
              onPress={() => {
                if (confirmDelete) {
                  setConfirmDelete(false);
                  setError('');
                } else onClose();
              }}
            >
              <Text style={[appearance.text, headingFont]}>Cancel</Text>
            </Button>
            <Button
              size="sm"
              variant="outlined"
              style={[base.footerButton, base.saveButton]}
              {...focusStyles}
              disabled={!confirmDelete && !title.trim()}
              onPress={() => {
                if (!confirmDelete) save();
                else if (onDelete()) onClose();
                else setError('Couldn’t delete this event. Try again.');
              }}
            >
              <Text style={[base.saveText, headingFont]}>
                {confirmDelete ? 'Delete event' : 'Save'}
              </Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
