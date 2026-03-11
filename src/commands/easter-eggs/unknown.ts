import type { Line } from '../../types';

export function unknown(cmd: string): Line[] {
  return [
    { text: `command not found: ${cmd}`, style: 'error' },
    { text: "Type 'help' to see available commands.", style: 'dim' },
  ];
}
