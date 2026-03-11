import type { Line } from '../../types';

export function gitStatus(): Line[] {
  return [
    { text: 'On branch main' },
    { text: '\u00A0' },
    { text: 'nothing to commit, working tree clean' },
    { text: '(you shipped it, remember?)', style: 'dim' },
  ];
}
