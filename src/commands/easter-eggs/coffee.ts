import type { Line } from '../../types';

export function coffee(): Line[] {
  return [
    { text: 'Brewing...', style: 'dim' },
    { text: 'Done. \u2615', delayMs: 2200 },
    { text: 'CPU clock increased to 4.20 GHz.', style: 'dim' },
  ];
}
