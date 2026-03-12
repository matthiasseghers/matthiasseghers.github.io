import type { CommandModule, Line, AboutData } from '../../types';
import { config } from '../../config';
import aboutData from '../../data/about.json';

const about = aboutData as AboutData;
const HEADER = `MATTHIAS(1)          User Commands          MATTHIAS(1)`;
const B: Line = { text: '\u00A0' };
const D = (text: string): Line => ({ text });
const d = (text: string): Line => ({ text, style: 'dim' });

export const command: CommandModule = {
  description: 'Read the manual — try: man matthias',
  fn: (args) => {
    const subject = (args[0] ?? '').toLowerCase();
    if (!subject) return [{ text: 'What manual page do you want?', style: 'error' }];
    if (subject !== 'matthias') return [{ text: `man: no entry for ${args[0]}`, style: 'error' }];

    return [
      { text: HEADER, style: 'bright' },
      B,
      { text: 'NAME', style: 'bright' },
      D(`       ${config.username} \u2014 ${about.title.toLowerCase()}, occasional overthinker`),
      B,
      { text: 'SYNOPSIS', style: 'bright' },
      D(`       ${config.username} [--coffee] [--remote] [--deadline approaching]`),
      B,
      { text: 'DESCRIPTION', style: 'bright' },
      D(`       ${about.name} is a ${about.location}-based ${about.title.toLowerCase()} with`),
      D(`       over a decade of experience turning coffee into code.`),
      B,
      D(`       Performs best in environments with clear problems,`),
      D(`       good tooling, and reasonable deadlines.`),
      B,
      { text: 'OPTIONS', style: 'bright' },
      D(`       --coffee`),
      d(`              Required. Not optional. See DEPENDENCIES.`),
      B,
      D(`       --remote`),
      d(`              Functions normally. Possibly better.`),
      B,
      D(`       --deadline approaching`),
      d(`              Activates focus mode. Do not disturb.`),
      B,
      { text: 'BUGS', style: 'bright' },
      D(`       Occasionally overengineers simple solutions.`),
      D(`       Known to start side projects at 11pm.`),
      B,
      { text: 'DEPENDENCIES', style: 'bright' },
      D(`       coffee >= 3.0.0`),
      D(`       good-problem (any version)`),
      B,
      { text: 'SEE ALSO', style: 'bright' },
      D(`       about(1), experience(1), projects(1)`),
      B,
      { text: HEADER, style: 'bright' },
    ];
  },
};
