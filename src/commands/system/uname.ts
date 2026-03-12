import type { CommandModule } from '../../types';
import { config } from '../../config';

export const command: CommandModule = {
  description: 'System information',
  fn: () => [{ text: `MATTHIAS-OS 26.0 #1 SMP Backend-Optimised x86_64 GNU/${config.username}` }],
};
