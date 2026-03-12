import type { CommandModule, Section } from '../../types';

const getSize = (data: unknown): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(data)).length;
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}K`;
};

export function makeLs(sections: Section[]): CommandModule {
  return {
    description: 'List available commands',
    fn: (args) => {
      const flags = args.filter((a) => a.startsWith('-'));
      const operands = args.filter((a) => !a.startsWith('-'));

      if (operands.length > 0) {
        return operands.map((o) => ({
          text: `ls: ${o}: No such file or directory`,
          style: 'error' as const,
        }));
      }

      const isLong = flags.some((f) => f === '-la' || f === '-a');
      if (isLong) {
        const sizes = sections.map((s) => getSize(s.data ?? {}));
        const maxLen = Math.max(...sizes.map((s) => s.length));
        return [
          { text: 'total 42', style: 'dim' },
          ...sections.map((s, i) => ({
            text: `-rwxr-xr-x  guest  ${(sizes[i] ?? '').padStart(maxLen)}  ${s.command}*`,
            style: 'bright' as const,
          })),
        ];
      }

      return [{ text: sections.map((s) => s.command + '*').join('    '), style: 'bright' }];
    },
  };
}
