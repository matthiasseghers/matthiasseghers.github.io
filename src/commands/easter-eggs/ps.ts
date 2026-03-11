import type { Line } from '../../types';
import { config } from '../../config';

export function ps(): Line[] {
  const u = config.username;
  return [
    { text: 'PID    USER      COMMAND', style: 'bright' },
    { text: `  1    ${u.padEnd(8)}  /sbin/init` },
    { text: `  42   ${u.padEnd(8)}  coffee-daemon --always` },
    { text: `  137  ${u.padEnd(8)}  imposter-syndrome [sleeping]`, style: 'dim' },
    { text: `  420  ${u.padEnd(8)}  side-project-manager [zombie]`, style: 'dim' },
    { text: `  666  ${u.padEnd(8)}  node_modules/.bin/webpack` },
  ];
}
