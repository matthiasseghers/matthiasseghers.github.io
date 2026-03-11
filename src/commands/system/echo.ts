import type { Line } from '../../types';

export function echo(args: string[]): Line[] {
  return [{ text: args.join(' ') || '\u00A0' }];
}
