import type { Section, Line, SkillsData } from '../../types';
import { sectionHeader } from '../../terminal/engine';
import data from '../../data/skills.json';

const skills = data as SkillsData;

export const skillsSection: Section = {
  command: 'skills',
  description: 'Tech stack',
  data: skills,
  render(): Line[] {
    const lines: Line[] = [...sectionHeader('Skills')];

    skills.categories.forEach((cat, i) => {
      lines.push({ text: cat.name, style: 'bright' });
      cat.items.forEach((item) => lines.push({ text: `    ${item}` }));
      if (i < skills.categories.length - 1) lines.push({ text: '' });
    });

    return lines;
  },
};
