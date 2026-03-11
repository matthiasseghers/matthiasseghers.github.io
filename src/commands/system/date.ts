import type { Line } from '../../types';

export const description = 'Current date and time';

export function date(): Line[] {
  return [{ text: new Date().toString() }];
}
