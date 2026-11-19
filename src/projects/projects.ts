import { isCalendarEvent } from './calendar/calendarEvents';
import { projectIcons, type ProjectIcon } from './projectIcons';
import { isProjectItem, type ProjectItem } from './projectItems';
import { isTagColor, type ProjectTag } from './projectTags';

export type ProjectDetails = {
  title: string;
  icon: ProjectIcon;
};

export type Project = ProjectDetails & {
  id: string;
  pinned?: boolean;
  tags?: ProjectTag[];
  items?: ProjectItem[];
};
export type ProjectChange = (projects: Project[]) => Project[];

const storageKey = 'planou.projects';

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== 'object') return false;

  const project = value as Partial<Project>;
  return (
    typeof project.id === 'string' &&
    typeof project.title === 'string' &&
    typeof project.icon === 'string' &&
    (project.pinned === undefined || typeof project.pinned === 'boolean') &&
    Object.hasOwn(projectIcons, project.icon)
  );
}

function readProjects(): Project[] {
  const saved = window.localStorage.getItem(storageKey);
  const projects: unknown = saved ? JSON.parse(saved) : [];
  if (!Array.isArray(projects)) return [];

  return projects.filter(isProject).map((project) => ({
    ...project,
    items: Array.isArray(project.items)
      ? project.items.filter(isProjectItem).map((item) =>
          item.boardFormat === 'calendar'
            ? {
                ...item,
                events: Array.isArray(item.events)
                  ? item.events.filter(isCalendarEvent)
                  : [],
              }
            : item,
        )
      : [],
    tags: Array.isArray(project.tags)
      ? project.tags.filter(
          (tag) =>
            tag &&
            typeof tag.name === 'string' &&
            tag.name.trim() &&
            typeof tag.color === 'string' &&
            isTagColor(tag.color),
        )
      : [],
  }));
}

export function loadProjects(): Project[] {
  try {
    return readProjects();
  } catch {
    return [];
  }
}

export function saveProjectChanges(change: ProjectChange): Project[] {
  const projects = change(readProjects());
  window.localStorage.setItem(storageKey, JSON.stringify(projects));
  return projects;
}
