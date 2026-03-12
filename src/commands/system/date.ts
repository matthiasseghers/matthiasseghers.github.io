import type { CommandModule } from '../../types';

export const command: CommandModule = {
  description: 'Current date and time',
  fn: () => [{ text: new Date().toString() }],
};
