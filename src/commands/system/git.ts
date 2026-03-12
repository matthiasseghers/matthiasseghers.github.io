import type { CommandModule } from '../../types';
import { gitLog } from './gitlog';
import { gitStatus } from '../easter-eggs/git-status';

export const command: CommandModule = {
  description: 'git log, git status',
  fn: (args) => {
    if (args[0] === 'log') return gitLog();
    if (args[0] === 'status') return gitStatus();
    return [{ text: `git: '${args[0] ?? ''}' is not a git command`, style: 'error' }];
  },
};
