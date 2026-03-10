import type { Section, Line, ExperienceEntry } from '../types';
import { sectionHeader } from '../terminal/engine';
import { renderTable } from '../terminal/table';
import data from '../data/experience.json';

const entries = data as ExperienceEntry[];

export const experienceSection: Section = {
  command: 'experience',
  description: 'Work history',
  data: entries,
  render(): Line[] {
    const lines: Line[] = [...sectionHeader('Experience')];

    lines.push(
      ...renderTable({
        headers: ['Period', 'Company', 'Role'],
        rows: entries.map((e) => [`${e.from} – ${e.to}`, e.company, e.role]),
        style: 'separated',
        align: ['center', 'left', 'left'],
      }),
    );

    // Highlights per entry (below the table)
    entries.forEach((entry) => {
      if (entry.highlights.length > 0) {
        lines.push({ text: '' });
        lines.push({ text: `${entry.company}`, style: 'bright' });
        entry.highlights.forEach((h) => lines.push({ text: `· ${h}` }));
      }
    });

    return lines;
  },
};
