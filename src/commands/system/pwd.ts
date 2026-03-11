import type { Line } from '../../types';
import { config } from '../../config';

export const description = 'Current directory';

export function pwd(): Line[] {
  return [{ text: `/home/${config.username}` }];
}
