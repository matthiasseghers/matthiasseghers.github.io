import type { CommandModule } from '../../types';

export const command: CommandModule = {
  description: 'Just try it',
  fn: (args) => [{ text: args.join(' ') || '\u00A0' }],
};
