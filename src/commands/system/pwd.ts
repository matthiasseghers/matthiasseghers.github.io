import type { CommandModule } from '../../types';
import { config } from '../../config';

export const command: CommandModule = {
  description: 'Current directory',
  fn: () => [{ text: `/home/${config.username}` }],
};
