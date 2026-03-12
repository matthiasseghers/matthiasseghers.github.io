import type { CommandModule } from '../../types';

const KNOWN = [
  'node',
  'npm',
  'git',
  'ls',
  'cat',
  'echo',
  'pwd',
  'env',
  'bash',
  'sh',
  'zsh',
  'python',
  'php',
];

export const command: CommandModule = {
  description: 'Locate a command',
  fn: (args) => {
    if (!args.length) return [{ text: 'which: missing argument', style: 'error' }];
    const target = (args[0] ?? '').toLowerCase();
    if (target === 'coffee') return [{ text: '/usr/local/bin/coffee' }];
    if (KNOWN.includes(target)) return [{ text: `/usr/bin/${target}` }];
    return [{ text: `which: ${args[0] ?? ''}: not found`, style: 'error' }];
  },
};
