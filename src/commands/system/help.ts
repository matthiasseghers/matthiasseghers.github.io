import type { Line } from '../../types';

export function help(descriptions: Map<string, string>): Line[] {
  return [
    { text: 'Commands:', style: 'bright' },
    { text: '\u00A0' },
    ...Array.from(descriptions.entries()).map(([cmd, desc]) => ({
      text: `${cmd.padEnd(16)}${desc}`,
    })),
    { text: '\u00A0' },
    {
      text: 'Tab to autocomplete  ·  ↑↓ for history  ·  Ctrl+L to clear  ·  Ctrl+C to cancel',
      style: 'dim' as const,
    },
    { text: '\u00A0' },
    { text: 'not all commands are listed here', style: 'dim' as const },
  ];
}