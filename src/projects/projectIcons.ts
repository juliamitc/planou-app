import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Camera,
  Coffee,
  Dumbbell,
  Folder,
  Heart,
  House,
  Leaf,
  Lightbulb,
  Music2,
  Plane,
  ShoppingBasket,
  Star,
} from 'lucide-react-native';

export const projectIcons = {
  folder: { label: 'Folder', Icon: Folder },
  calendar: { label: 'Calendar', Icon: CalendarDays },
  work: { label: 'Briefcase', Icon: Briefcase },
  home: { label: 'Home', Icon: House },
  reading: { label: 'Book', Icon: BookOpen },
  shopping: { label: 'Basket', Icon: ShoppingBasket },
  heart: { label: 'Heart', Icon: Heart },
  leaf: { label: 'Leaf', Icon: Leaf },
  idea: { label: 'Light bulb', Icon: Lightbulb },
  star: { label: 'Star', Icon: Star },
  travel: { label: 'Plane', Icon: Plane },
  fitness: { label: 'Dumbbell', Icon: Dumbbell },
  coffee: { label: 'Coffee', Icon: Coffee },
  photos: { label: 'Camera', Icon: Camera },
  music: { label: 'Music', Icon: Music2 },
};

export type ProjectIcon = keyof typeof projectIcons;
