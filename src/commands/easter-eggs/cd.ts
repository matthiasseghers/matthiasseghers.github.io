import type { Line } from '../../types';

export function cd(args: string[]): Line[] {
  const target = args[0] ?? '';
  if (target === '' || target === '~') return [];
  if (target === '..') return [{ text: "You're already at the top.", style: 'dim' }];
  return [{ text: `cd: ${target}: No such file or directory`, style: 'error' }];
}
