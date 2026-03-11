import type { Section, Line, ProjectEntry } from '../../types';
import { sectionHeader, indent, linkLine } from '../../terminal/engine';
import data from '../../data/projects.json';

const entries = data as ProjectEntry[];

export const projectsSection: Section = {
  command: 'projects',
  description: 'Side projects & repos',
  data: entries,
  render(): Line[] {
    const lines: Line[] = [...sectionHeader('Projects')];

    entries.forEach((entry, i) => {
      const nameLine: Line = entry.url
        ? linkLine(entry.name, entry.url, entry.name)
        : { text: indent(entry.name), style: 'bright' };

      lines.push(
        { ...nameLine, style: 'bright' },
        { text: indent(entry.description) },
        { text: indent(`[${entry.tech.join(', ')}]`, 4), style: 'dim' },
      );

      if (i < entries.length - 1) {
        lines.push({ text: '' });
      }
    });

    return lines;
  },
};
