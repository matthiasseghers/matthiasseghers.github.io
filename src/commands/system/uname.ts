import type { Line } from '../../types';
import { config } from '../../config';

export const description = 'System information';

export function uname(): Line[] {
  return [{ text: `MATTHIAS-OS 26.0 #1 SMP Backend-Optimised x86_64 GNU/${config.username}` }];
}
