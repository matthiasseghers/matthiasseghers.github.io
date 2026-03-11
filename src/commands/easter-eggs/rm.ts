import type { Line } from '../../types';

export function rm(args: string[]): Line[] {
  const isRecursive = args.includes('-rf') || args.includes('-fr') || args.includes('-r');
  const targetsRoot = args.includes('/');
  if (isRecursive && targetsRoot) {
    return [{ text: "rm: cannot remove '/': Permission denied", style: 'error' }];
  }
  if (isRecursive) {
    return [{ text: 'rm: cannot remove: Permission denied', style: 'error' }];
  }
  return [{ text: 'rm: missing operand', style: 'error' }];
}
