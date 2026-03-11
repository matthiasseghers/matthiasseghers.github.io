import type { Line, Section, AboutData } from '../../types';
import { config } from '../../config';
import aboutData from '../../data/about.json';

const about = aboutData as AboutData;

export const description = 'Print a section — try: cat about';

export function cat(args: string[], sections: Section[]): Line[] {
  if (args.length === 0) return [{ text: 'cat: missing operand', style: 'error' }];
  const raw = args[0] ?? '';
  const name = raw.replace(/^\.\//, '');

  // Easter egg: cat /etc/passwd
  if (name === '/etc/passwd' || name === 'etc/passwd') {
    return [
      {
        text: `${config.username}:x:1000:1000:${about.name}:/home/${config.username}:/bin/coffee`,
        style: 'dim',
      },
    ];
  }

  const section = sections.find((s) => s.command === name);
  if (section) return section.render();
  return [{ text: `cat: ${raw}: No such file or directory`, style: 'error' }];
}
