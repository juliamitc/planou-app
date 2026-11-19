import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from 'tamagui/button';

import {
  buttonFocusStyles,
  layoutColors,
  type LayoutTheme,
} from '../../theme/colors';
import type { ProjectItem } from '../projectItems';
import { styles } from './CalendarBoard.styles';
import { EventDialog } from './EventDialog';
import {
  addDays,
  dateKey,
  startOfWeek,
  type CalendarEvent,
  type EventDetails,
} from './calendarEvents';

type CalendarBoardProps = {
  board: ProjectItem;
  projectTitle: string;
  theme: LayoutTheme;
  fontsLoaded: boolean;
  onBack: () => void;
  onChangeEvents: (
    change: (events: CalendarEvent[]) => CalendarEvent[],
  ) => boolean;
};

type EventDraft = {
  date: string;
  event?: CalendarEvent;
  returnFocusId: string;
};

const dayName = new Intl.DateTimeFormat('en', { weekday: 'short' });
const weekRange = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function CalendarBoard({
  board,
  projectTitle,
  theme,
  fontsLoaded,
  onBack,
  onChangeEvents,
}: CalendarBoardProps) {
  const [week, setWeek] = useState(() => startOfWeek(new Date()));
  const [draft, setDraft] = useState<EventDraft>();
  const colors = layoutColors[theme];
  const appearance = styles[theme];
  const base = styles.base;
  const text = [appearance.text, fontsLoaded && base.bodyFont];
  const heading = [appearance.text, fontsLoaded && base.headingFont];
  const focusStyles = buttonFocusStyles(theme);
  const today = dateKey(new Date());
  const days = Array.from({ length: 7 }, (_, index) => addDays(week, index));
  const weekEnd = addDays(week, 6);
  const newEventDate =
    today >= dateKey(week) && today <= dateKey(weekEnd) ? today : dateKey(week);

  function saveEvent(details: EventDetails) {
    const eventId = draft?.event?.id;
    const id =
      eventId ??
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const event = { ...details, id };
    const saved = onChangeEvents((events) => {
      if (!eventId) return [...events, event];
      if (!events.some((current) => current.id === eventId))
        throw new Error('The event no longer exists.');
      return events.map((current) =>
        current.id === eventId ? event : current,
      );
    });
    if (saved) setWeek(startOfWeek(new Date(`${details.date}T12:00:00`)));
    return saved;
  }

  return (
    <ScrollView contentContainerStyle={base.page}>
      <View style={base.header}>
        <Button
          size="sm"
          variant="quiet"
          style={base.back}
          {...focusStyles}
          onPress={onBack}
        >
          <ArrowLeft size={16} color={colors.muted} />
          <Text style={[appearance.muted, fontsLoaded && base.bodyFont]}>
            {projectTitle}
          </Text>
        </Button>
        <Text accessibilityRole="header" style={[base.title, heading]}>
          {board.title}
        </Text>
      </View>
      <View style={base.toolbar}>
        <Text
          accessibilityLiveRegion="polite"
          style={[base.weekTitle, heading]}
        >
          {weekRange.formatRange(week, weekEnd)}
        </Text>
        <Button
          size="sm"
          variant="quiet"
          aria-label="Previous week"
          style={base.iconButton}
          {...focusStyles}
          onPress={() => setWeek(addDays(week, -7))}
        >
          <ChevronLeft size={17} color={colors.muted} />
        </Button>
        <Button
          size="sm"
          variant="outlined"
          style={[base.action, appearance.surface]}
          {...focusStyles}
          onPress={() => setWeek(startOfWeek(new Date()))}
        >
          <Text style={text}>Today</Text>
        </Button>
        <Button
          size="sm"
          variant="quiet"
          aria-label="Next week"
          style={base.iconButton}
          {...focusStyles}
          onPress={() => setWeek(addDays(week, 7))}
        >
          <ChevronRight size={17} color={colors.muted} />
        </Button>
        <Button
          id="new-calendar-event"
          size="sm"
          variant="outlined"
          style={[base.action, base.primary]}
          {...focusStyles}
          onPress={() =>
            setDraft({
              date: newEventDate,
              returnFocusId: 'new-calendar-event',
            })
          }
        >
          <Plus size={16} color="#fff" />
          <Text style={[base.primaryText, fontsLoaded && base.headingFont]}>
            New event
          </Text>
        </Button>
      </View>
      <ScrollView horizontal contentContainerStyle={base.week}>
        {days.map((day) => {
          const date = dateKey(day);
          const addEventId = `add-event-${date}`;
          const events = (board.events ?? [])
            .filter((event) => event.date === date)
            .sort(
              (a, b) =>
                Number(b.allDay) - Number(a.allDay) ||
                (a.startTime ?? '').localeCompare(b.startTime ?? ''),
            );
          return (
            <View key={date} style={[base.day, appearance.surface]}>
              <View
                style={[
                  base.dayHeader,
                  appearance.dayHeader,
                  date === today && appearance.today,
                ]}
              >
                <View>
                  <Text
                    style={[
                      base.dayLabel,
                      appearance.muted,
                      fontsLoaded && base.bodyFont,
                    ]}
                  >
                    {dayName.format(day)}
                  </Text>
                  <Text
                    style={[
                      base.dayNumber,
                      heading,
                      date === today && appearance.todayText,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </View>
                <Button
                  id={addEventId}
                  size="sm"
                  variant="quiet"
                  aria-label={`Add event on ${date}`}
                  style={base.iconButton}
                  {...focusStyles}
                  onPress={() => setDraft({ date, returnFocusId: addEventId })}
                >
                  <Plus size={15} color={colors.selectionInk} />
                </Button>
              </View>
              <View style={base.events}>
                {events.map((event) => {
                  const buttonId = `calendar-event-${event.id}`;
                  const time = event.allDay
                    ? 'All day'
                    : [event.startTime, event.endTime]
                        .filter(Boolean)
                        .join('–');
                  return (
                    <Button
                      id={buttonId}
                      key={event.id}
                      size="sm"
                      variant="quiet"
                      aria-label={`Edit ${event.title}`}
                      style={[base.event, appearance.event]}
                      {...focusStyles}
                      onPress={() =>
                        setDraft({ date, event, returnFocusId: buttonId })
                      }
                    >
                      <Text
                        style={[
                          base.time,
                          appearance.todayText,
                          fontsLoaded && base.bodyFont,
                        ]}
                      >
                        {time}
                      </Text>
                      <Text style={[base.eventTitle, heading]}>
                        {event.title}
                      </Text>
                    </Button>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
      {draft && (
        <EventDialog
          event={draft.event}
          date={draft.date}
          returnFocusId={draft.returnFocusId}
          theme={theme}
          fontsLoaded={fontsLoaded}
          onSave={saveEvent}
          onDelete={() =>
            onChangeEvents((events) =>
              events.filter((event) => event.id !== draft.event?.id),
            )
          }
          onClose={() => setDraft(undefined)}
        />
      )}
    </ScrollView>
  );
}
