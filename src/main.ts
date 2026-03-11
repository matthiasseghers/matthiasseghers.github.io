// ─── Styles ───────────────────────────────────────────────────────────────────
import './styles/themes/green.css';
import './styles/reset.css';
import './styles/crt.css';
import './styles/terminal.css';

// ─── Config ───────────────────────────────────────────────────────────────────
import { config } from './config';

// ─── Terminal ─────────────────────────────────────────────────────────────────
import {
  clearOutput,
  printOutput,
  printEcho,
  printLine,
  isSerialMode,
  scrollToBottom,
  hideInputLine,
  showInputLine,
} from './terminal/engine';
import { runBoot }                          from './terminal/boot';
import { showWelcome }                      from './terminal/welcome';
import { initPrompt, initInput, inputState, lockInput, unlockInput } from './terminal/input';

// ─── Commands ─────────────────────────────────────────────────────────────────
import { registry, special, unknown, SECTIONS } from './commands/registry';

// ─── Active modal cleanup (e.g. hack matrix rain) ────────────────────────────

let activeCleanup: (() => void) | null = null;

document.addEventListener(
  'keydown',
  (e: KeyboardEvent) => {
    if (activeCleanup && e.ctrlKey && e.key === 'c') {
      e.stopImmediatePropagation();
      activeCleanup();
      activeCleanup = null;
    }
  },
  true,
);

// ─── Serial-mode gate ────────────────────────────────────────────────────────
// Hides input and locks keyboard during animated output.

async function runLocked(fn: () => Promise<void>): Promise<void> {
  if (isSerialMode()) lockInput();
  try {
    await fn();
  } finally {
    if (isSerialMode()) unlockInput();
  }
}

// ─── Reboot ───────────────────────────────────────────────────────────────────

function reboot(): void {
  printLine({ text: 'System going down for reboot now...', style: 'warn' });
  lockInput();
  setTimeout(() => {
    clearOutput();
    void runBoot(config, async () => {
      await showWelcome(SECTIONS);
      unlockInput();
    });
  }, 1000);
}

// ─── Command executor ─────────────────────────────────────────────────────────

async function execute(raw: string): Promise<void> {
  const parts = raw.trim().split(/\s+/);
  let cmd = parts[0]?.toLowerCase() ?? '';
  const args = parts.slice(1);

  if (!cmd) return;

  // Strip ./ prefix — treat ./about the same as about
  if (cmd.startsWith('./')) cmd = cmd.slice(2);

  // Internal signal used by Ctrl+L to re-show welcome without echo
  if (cmd === '__welcome__') {
    await runLocked(() => showWelcome(SECTIONS));
    return;
  }

  // Standard registry lookup
  const fn = registry.get(cmd);
  if (fn) {
    await runLocked(async () => printOutput(await fn(args)));
    return;
  }

  // Special commands that can't return Line[]
  switch (cmd) {
    case 'clear':
      clearOutput();
      await runLocked(() => showWelcome(SECTIONS));
      break;

    case 'reboot':
      reboot();
      break;

    case 'matrix': {
      lockInput();
      hideInputLine();
      const cleanup = await special.matrix();
      activeCleanup = () => {
        cleanup();
        unlockInput();
      };
      break;
    }

    case 'sudo':
      await runLocked(() => special.sudo(args, reboot));
      break;

    default:
      await runLocked(() => printOutput(unknown(cmd)));
      break;
  }
}

// ─── Boot & init ──────────────────────────────────────────────────────────────

initPrompt(config);

void runBoot(config, async () => {
  await showWelcome(SECTIONS);
  unlockInput();
  initInput(
    config,
    SECTIONS,
    [...registry.keys()],
    (raw) => { void execute(raw); },
    reboot,
  );
});