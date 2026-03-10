import type { Line } from '../../types';
import { printOutput } from '../../terminal/engine';
import cfg from '../../config.json';
import type { Config } from '../../types';

const config = cfg as Config;

export function cmdRm(args: string[]): Line[] {
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

export function cmdExit(): Line[] {
  return [
    { text: 'logout', style: 'dim' },
    { text: '\u00A0' },
    { text: 'There is no escape.', style: 'dim' },
  ];
}

export function cmdPsAux(): Line[] {
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

export function cmdChmod(args: string[]): Line[] {
  if (!args.length) return [{ text: 'chmod: missing operand', style: 'error' }];
  return [{ text: `${config.username} already has all permissions here.`, style: 'dim' }];
}

export function cmdUnknown(cmd: string): Line[] {
  return [
    { text: `command not found: ${cmd}`, style: 'error' },
    { text: "Type 'help' to see available commands.", style: 'dim' },
  ];
}

export async function cmdPing(args: string[]): Promise<void> {
  const host = args[0] ?? 'unknown';
  await printOutput([{ text: `PING ${host}: 56 data bytes` }]);
  for (let i = 1; i <= 4; i++) {
    await new Promise((r) => setTimeout(r, 600));
    const ms = (3 + Math.random() * 2).toFixed(3);
    const time = i === 3 ? '3.141' : ms;
    await printOutput([{ text: `64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${time} ms` }]);
  }
  await new Promise((r) => setTimeout(r, 400));
  await printOutput([
    { text: '\u00A0' },
    { text: `--- ${host} ping statistics ---` },
    { text: `4 packets transmitted, 4 received, 0% packet loss`, style: 'dim' },
  ]);
}

export async function cmdCoffee(): Promise<void> {
  await printOutput([{ text: 'Brewing...', style: 'dim' }]);
  await new Promise((r) => setTimeout(r, 2200));
  await printOutput([
    { text: 'Done. \u2615' },
    { text: 'CPU clock increased to 4.20 GHz.', style: 'dim' },
  ]);
}

export function cmdGitStatus(): Line[] {
  return [
    { text: 'On branch main' },
    { text: '\u00A0' },
    { text: 'nothing to commit, working tree clean' },
    { text: '(you shipped it, remember?)', style: 'dim' },
  ];
}

export function cmdCd(args: string[]): Line[] {
  const target = args[0] ?? '';
  if (target === '' || target === '~') return [];
  if (target === '..') return [{ text: "You're already at the top.", style: 'dim' }];
  return [{ text: `cd: ${target}: No such file or directory`, style: 'error' }];
}

export async function cmdNpmInstall(): Promise<void> {
  await printOutput([
    { text: 'npm warn deprecated several-things@1.x: Use the new thing instead', style: 'warn' },
  ]);
  const fetches = [
    'npm http fetch GET 200 https://registry.npmjs.org/lodash',
    'npm http fetch GET 200 https://registry.npmjs.org/chalk',
    'npm http fetch GET 200 https://registry.npmjs.org/typescript',
    'npm http fetch GET 200 https://registry.npmjs.org/webpack',
  ];
  for (const line of fetches) {
    await new Promise((r) => setTimeout(r, 320));
    await printOutput([{ text: line, style: 'dim' }]);
  }
  await new Promise((r) => setTimeout(r, 700));
  await printOutput([
    { text: '\u00A0' },
    { text: 'added 847 packages in 3s' },
    { text: '\u00A0' },
    { text: '247 packages are looking for funding', style: 'dim' },
    { text: '  run `npm fund` for details', style: 'dim' },
  ]);
}
