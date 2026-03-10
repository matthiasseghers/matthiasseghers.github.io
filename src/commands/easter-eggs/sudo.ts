import { printOutput } from '../../terminal/engine';
import cfg from '../../config.json';
import type { Config } from '../../types';

const config = cfg as Config;

export async function cmdSudo(args: string[], onReboot: () => void): Promise<void> {
  const joined = args.join(' ');
  const isRmRfRoot =
    args.includes('rm') && (args.includes('-rf') || args.includes('-fr')) && args.includes('/');

  if (isRmRfRoot) {
    await cmdSudoRmRfRoot(onReboot);
    return;
  }

  if (joined.trim() === '') {
    await printOutput([{ text: 'sudo: no command specified', style: 'error' }]);
    return;
  }

  // wrong password loop
  await printOutput([{ text: `[sudo] password for ${config.username}:`, style: 'dim' }]);
  await new Promise((r) => setTimeout(r, 1400));
  await printOutput([{ text: 'Sorry, try again.', style: 'error' }]);
  await new Promise((r) => setTimeout(r, 800));
  await printOutput([{ text: `[sudo] password for ${config.username}:`, style: 'dim' }]);
  await new Promise((r) => setTimeout(r, 1800));
  await printOutput([{ text: 'Sorry, try again.', style: 'error' }]);
  await new Promise((r) => setTimeout(r, 600));
  await printOutput([{ text: 'sudo: 2 incorrect password attempts', style: 'error' }]);
}

export async function cmdSudoRmRfRoot(onReboot: () => void): Promise<void> {
  await printOutput([{ text: `[sudo] password for ${config.username}:`, style: 'dim' }]);
  await new Promise((r) => setTimeout(r, 1200));

  // phase 1 — glitch lines print fast
  const glitch = [
    'Segmentation fault (core dumped)',
    'KERNEL PANIC \u2014 not syncing: Attempted to kill init!',
    'EIP: [<ffffffff81234abc>] do_exit+0x0/0x300',
    'CPU: 0 PID: 1 Comm: systemd Tainted: G D',
    '\u2591\u2592\u2593\u2588\u2593\u2592\u2591\u2591\u2592\u2593\u2588\u2593\u2592\u2591',
    '[  OK  ] unmounting filesystems...',
    '\u2593\u2592\u2591 MATTHIAS-OS CRITICAL FAILURE \u2591\u2592\u2593',
  ];
  for (const g of glitch) {
    await new Promise((r) => setTimeout(r, 120));
    await printOutput([{ text: g, style: 'error' }]);
  }

  await new Promise((r) => setTimeout(r, 300));

  // phase 2 — CSS glitch on the entire terminal
  const terminal = document.getElementById('terminal') ?? document.body;
  terminal.style.transition = 'none';

  const glitchFrames: { transform: string; filter: string }[] = [
    { transform: 'skewX(2deg)', filter: 'hue-rotate(90deg) brightness(2)' },
    { transform: 'skewX(-3deg) translateX(4px)', filter: 'invert(1)' },
    { transform: 'skewX(1deg) translateX(-6px)', filter: 'hue-rotate(180deg) brightness(3)' },
    { transform: 'skewX(-5deg) translateX(2px)', filter: 'saturate(10) brightness(0.5)' },
    { transform: 'none', filter: 'brightness(4)' },
    { transform: 'skewX(8deg)', filter: 'invert(1) hue-rotate(270deg)' },
    { transform: 'none', filter: 'none' },
  ];

  for (const frame of glitchFrames) {
    Object.assign(terminal.style, frame);
    await new Promise((r) => setTimeout(r, 80));
  }

  // phase 3 — flash to white then black
  terminal.style.filter = 'brightness(10)';
  await new Promise((r) => setTimeout(r, 80));
  terminal.style.filter = 'brightness(0)';
  await new Promise((r) => setTimeout(r, 400));

  // cleanup and reboot
  terminal.style.filter = 'none';
  terminal.style.transform = 'none';
  onReboot();
}
