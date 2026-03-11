import type { Section, Line } from '../../types';

export function help(sections: Section[]): Line[] {
  const B: Line = { text: '\u00A0' };
  const otherSections = sections.filter((s) => s.command !== 'about');

  return [
    { text: 'Commands:', style: 'bright' },
    B,
    { text: `about / whoami  Who am I` },
    ...otherSections.map((s) => ({ text: `${s.command.padEnd(16)}${s.description}` }) as Line),
    B,
    { text: 'git log         How I got here' },
    { text: 'neofetch        System info, neofetch-style' },
    { text: 'echo            Just try it' },
    { text: 'clear           Clear the terminal' },
    { text: 'reboot          Replay the boot sequence' },
    { text: 'date            Current date and time' },
    { text: 'help            Show this message' },
    B,
    {
      text: 'Tab to autocomplete  ·  ↑↓ for history  ·  Ctrl+L to clear  ·  Ctrl+C to cancel',
      style: 'dim',
    },
    B,
    { text: 'not all commands are listed here', style: 'dim' },
  ];
}
