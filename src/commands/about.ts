import type { Section, Line, AboutData } from '../types';
import { sectionHeader, indent } from '../terminal/engine';
import data from '../data/about.json';

const about = data as AboutData;

export const aboutSection: Section = {
  command: 'about',
  description: 'Who am I',
  data: about,
  render(): Line[] {
    return [
      ...sectionHeader(about.name),
      { text: indent(`${about.title}  ·  ${about.company}  ·  ${about.location}`) },
      { text: '' },
      ...about.bio.map((line) => ({ text: indent(line) })),
    ];
  },
};
