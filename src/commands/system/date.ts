import type { Line } from '../../types';

export function date(): Line[] {
  return [{ text: new Date().toString() }];
}
