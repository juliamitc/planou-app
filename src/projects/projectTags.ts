export type ProjectTag = {
  name: string;
  color: string;
};

export const tagColors = [
  { name: 'Green', value: '#B8E6C8' },
  { name: 'Red', value: '#F5B7AE' },
  { name: 'Yellow', value: '#F8E7A4' },
  { name: 'Blue', value: '#B9DCF6' },
  { name: 'Purple', value: '#D8C6F2' },
  { name: 'Pink', value: '#F1C3DC' },
  { name: 'Gray', value: '#DCE2EB' },
];

export function tagKey(name: string) {
  return name.trim().toLowerCase();
}

export function isTagColor(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color);
}

export function hasTag(tags: ProjectTag[] | undefined, key: string) {
  return tags?.some((tag) => tagKey(tag.name) === key) ?? false;
}

export function colorForHue(hue: number) {
  // The slider keeps saturation and lightness steady and only changes the hue.
  const lightness = 0.64;
  const chroma = 0.53 * Math.min(lightness, 1 - lightness);
  const channels = [0, 8, 4].map((offset) => {
    const position = (offset + hue / 30) % 12;
    const intensity =
      lightness -
      chroma * Math.max(-1, Math.min(position - 3, 9 - position, 1));
    return Math.round(255 * intensity)
      .toString(16)
      .padStart(2, '0');
  });
  return `#${channels.join('').toUpperCase()}`;
}
