import type { Line } from '../../types';

export function exit(): Line[] {
  return [
    { text: 'logout', style: 'dim' },
    { text: '\u00A0' },
    { text: 'There is no escape.', style: 'dim' },
  ];
}
