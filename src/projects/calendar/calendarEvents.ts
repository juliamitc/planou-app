export type EventDetails = {
  title: string;
  date: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
};

export type CalendarEvent = EventDetails & { id: string };

export function dateKey(date: Date) {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfWeek(date: Date) {
  return addDays(date, -((date.getDay() + 6) % 7));
}

export function isEventDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isFinite(parsed.valueOf()) && dateKey(parsed) === date;
}

export function isEventTime(time: string) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
}

export function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Partial<CalendarEvent>;
  return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    !!event.title.trim() &&
    typeof event.date === 'string' &&
    isEventDate(event.date) &&
    (event.allDay === true ||
      (event.allDay === false &&
        typeof event.startTime === 'string' &&
        isEventTime(event.startTime) &&
        (event.endTime === undefined ||
          (typeof event.endTime === 'string' &&
            isEventTime(event.endTime) &&
            event.endTime > event.startTime))))
  );
}
