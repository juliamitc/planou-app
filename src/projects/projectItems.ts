import {
  FileText,
  LayoutDashboard,
  ListChecks,
  ListTodo,
  NotebookPen,
} from 'lucide-react-native';

import type { CalendarEvent } from './calendar/calendarEvents';

export const boardFormats = {
  calendar: 'Calendar',
  kanban: 'Kanban',
  freeform: 'Freeform',
} as const;

export const itemTypes = {
  board: {
    label: 'Board',
    description: 'Plan visually and arrange ideas.',
    Icon: LayoutDashboard,
  },
  note: {
    label: 'Note',
    description: 'Write and collect your thoughts.',
    Icon: NotebookPen,
  },
  list: {
    label: 'List',
    description: 'Create a simple checklist.',
    Icon: ListChecks,
  },
  taskList: {
    label: 'Task list',
    description: 'Track tasks, deadlines, and progress.',
    Icon: ListTodo,
  },
  document: {
    label: 'Document',
    description: 'Keep documents for reference.',
    Icon: FileText,
  },
};

export type ItemType = keyof typeof itemTypes;
export type BoardFormat = keyof typeof boardFormats;
export type ItemDetails = {
  title: string;
  type: ItemType;
  boardFormat?: BoardFormat;
};
export type ProjectItem = ItemDetails & {
  id: string;
  events?: CalendarEvent[];
};

export function isProjectItem(value: unknown): value is ProjectItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ProjectItem>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    !!item.title.trim() &&
    typeof item.type === 'string' &&
    Object.hasOwn(itemTypes, item.type) &&
    (item.boardFormat === undefined ||
      (item.type === 'board' &&
        typeof item.boardFormat === 'string' &&
        Object.hasOwn(boardFormats, item.boardFormat)))
  );
}
