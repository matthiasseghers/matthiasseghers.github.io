import type { Line } from '../../types';
import { config } from '../../config';

export function chmod(args: string[]): Line[] {
  if (!args.length) return [{ text: 'chmod: missing operand', style: 'error' }];
  return [{ text: `${config.username} already has all permissions here.`, style: 'dim' }];
}
