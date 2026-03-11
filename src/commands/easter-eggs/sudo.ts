import { printOutput } from '../../terminal/engine';
import { config } from '../../config';

// ─── Note ─────────────────────────────────────────────────────────────────────
// sudo stays as a special async export because:
//   1. sudoRmRfRoot performs direct DOM manipulation for the glitch effect
//   2. sudo needs the onReboot callback passed in from main.ts
// These genuinely cannot be expressed as a plain Line[] return.

export async function sudo(args: string[], onReboot: () => void): Promise<void> {
  const joined = args.join(' ');
  const isRmRfRoot =
    args.includes('rm') && (args.includes('-rf') || args.includes('-fr')) && args.includes('/');

  if (isRmRfRoot) {
    await sudoRmRfRoot(onReboot);
    return;
  }

  if (joined.trim() === '') {
    await printOutput([{ text: 'sudo: no command specified', style: 'error' }]);
    return;
  }

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

export async function sudoRmRfRoot(onReboot: () => void): Promise<void> {
  await printOutput([{ text: `[sudo] password for ${config.username}:`, style: 'dim' }]);
  await new Promise((r) => setTimeout(r, 1200));

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

  terminal.style.filter = 'brightness(10)';
  await new Promise((r) => setTimeout(r, 80));
  terminal.style.filter = 'brightness(0)';
  await new Promise((r) => setTimeout(r, 400));

  terminal.style.filter = 'none';
  terminal.style.transform = 'none';
  onReboot();
}
