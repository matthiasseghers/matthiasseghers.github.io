import type { Section, Line, LinkEntry } from '../../types';
import { sectionHeader, linkLine } from '../../terminal/engine';
import data from '../../data/links.json';

const entries = data as LinkEntry[];

export const linksSection: Section = {
  command: 'links',
  description: 'GitHub, LinkedIn & more',
  data: entries,
  render(): Line[] {
    return [
      ...sectionHeader('Links'),
      ...entries.map((e) => linkLine(e.label, e.url, e.description)),
    ];
  },
};
