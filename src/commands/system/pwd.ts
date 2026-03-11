import type { Line } from '../../types';
import { config } from '../../config';

export function pwd(): Line[] {
  return [{ text: `/home/${config.username}` }];
}
