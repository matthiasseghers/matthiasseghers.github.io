import type { Line } from '../../types';

export const description = 'Just try it';

export function echo(args: string[]): Line[] {
  return [{ text: args.join(' ') || '\u00A0' }];
}
