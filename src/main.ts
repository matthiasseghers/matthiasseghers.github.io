// ─── Styles ───────────────────────────────────────────────────────────────────
import './styles/themes/green.css';
import './styles/reset.css';
import './styles/crt.css';
import './styles/terminal.css';

// ─── Core ─────────────────────────────────────────────────────────────────────
import type { Line } from './types';
import type { Config } from './types';
import cfg from './config.json';
import { aboutSection } from './commands/about';
import { experienceSection } from './commands/experience';
import { projectsSection } from './commands/projects';
import { skillsSection } from './commands/skills';
import { linksSection } from './commands/links';

// ─── Content sections ─────────────────────────────────────────────────────────
// To add a new section:
//   1. Create src/data/your-section.json
//   2. Create src/commands/your-section.ts exporting a Section
//   3. Import it here and add it to SECTIONS

const SECTIONS = [aboutSection, experienceSection, projectsSection, skillsSection, linksSection];

function findSection(command: string) {
  return SECTIONS.find((s) => s.command === command);
}

import {
  clearOutput,
  printOutput,
  printEcho,
  isSerialMode,
  scrollToBottom,
} from './terminal/engine';
import { runBoot } from './terminal/boot';
import { initPrompt, initInput, inputState } from './terminal/input';
import { showWelcome } from './terminal/welcome';
import {
  showHelp,
  cmdDate,
  cmdPwd,
  cmdLs,
  cmdCat,
  cmdUname,
  cmdReboot,
  cmdNeofetch,
  cmdWhoami,
  cmdEcho,
  cmdWhich,
  cmdEnv,
  cmdMan,
} from './commands/builtins';
import {
  cmdSudo,
  cmdRm,
  cmdExit,
  cmdPsAux,
  cmdChmod,
  cmdUnknown,
  cmdPing,
  cmdCoffee,
  cmdGitStatus,
  cmdCd,
  cmdNpmInstall,
  cmdHack,
} from './commands/easter-eggs';
import { cmdGitLog } from './commands/gitlog';

const config = cfg as Config;

// ─── Command tables ─────────────────────────────────────────────────────────────────

interface CmdEntry {
  command: string;
  fn: (args: string[]) => Line[];
}

const BUILTIN_COMMANDS: CmdEntry[] = [
  { command: 'whoami', fn: () => cmdWhoami() },
  { command: 'date', fn: () => cmdDate() },
  { command: 'pwd', fn: () => cmdPwd() },
  { command: 'uname', fn: () => cmdUname() },
  { command: 'env', fn: () => cmdEnv() },
  { command: 'neofetch', fn: () => cmdNeofetch() },
  { command: 'echo', fn: (args) => cmdEcho(args) },
  { command: 'ls', fn: (args) => cmdLs(SECTIONS, args) },
  { command: 'cat', fn: (args) => cmdCat(args, SECTIONS) },
  { command: 'which', fn: (args) => cmdWhich(args) },
  { command: 'ps', fn: () => cmdPsAux() },
  { command: 'chmod', fn: (args) => cmdChmod(args) },
  { command: 'man', fn: (args) => cmdMan(args) },
];

const EASTER_EGG_COMMANDS: CmdEntry[] = [
  { command: 'exit', fn: () => cmdExit() },
  { command: 'rm', fn: (args) => cmdRm(args) },
  { command: 'cd', fn: (args) => cmdCd(args) },
];

// ─── Built-in command names (for tab completion) ──────────────────────────────────────

const BUILTIN_NAMES = BUILTIN_COMMANDS.map((c) => c.command);
// ─── Active modal cleanup (e.g. hack matrix rain) ──────────────────────────────────────

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
); // capture phase — fires before input.ts listener
// ─── Serial-mode gate: hides input + locks keyboard during renders ────────────

const inputLineEl = document.getElementById('input-line') as HTMLElement;

async function runLocked(fn: () => Promise<void>): Promise<void> {
  if (isSerialMode()) {
    inputState.locked = true;
    inputLineEl.style.display = 'none';
  }
  try {
    await fn();
  } finally {
    if (isSerialMode()) {
      inputLineEl.style.display = 'flex';
      inputState.locked = false;
      scrollToBottom();
    }
  }
}

// ─── Command executor ─────────────────────────────────────────────────────────

async function execute(raw: string): Promise<void> {
  const parts = raw.trim().split(/\s+/);
  let cmd = parts[0]?.toLowerCase() ?? '';
  const args = parts.slice(1);

  if (!cmd) return;

  // bash-style history expansion
  if (raw.trim() === '!!') {
    const last = inputState.history[0];
    if (!last) {
      await runLocked(() => printOutput([{ text: '!!: no previous command', style: 'error' }]));
      return;
    }
    printEcho(config.prompt, last);
    return execute(last);
  }
  if (raw.trim() === '!$') {
    const last = inputState.history[0];
    if (!last) {
      await runLocked(() => printOutput([{ text: '!$: no previous command', style: 'error' }]));
      return;
    }
    const lastWord = last.trim().split(/\s+/).pop() ?? '';
    printEcho(config.prompt, lastWord);
    return execute(lastWord);
  }

  // Internal signal used by Ctrl+L to re-show the welcome banner without echo
  if (cmd === '__welcome__') {
    await runLocked(() => showWelcome(SECTIONS));
    return;
  }

  // ./section  — strip prefix and treat as the section name
  if (cmd.startsWith('./')) cmd = cmd.slice(2);

  // Content sections from registry
  const section = findSection(cmd);
  if (section) {
    await runLocked(() => printOutput(section.render()));
    return;
  }

  // Table lookup — builtins and sync easter eggs
  const entry = [...BUILTIN_COMMANDS, ...EASTER_EGG_COMMANDS].find((c) => c.command === cmd);
  if (entry) {
    await runLocked(() => printOutput(entry.fn(args)));
    return;
  }

  // Special cases that need unique wiring
  switch (cmd) {
    case 'help':
      await runLocked(() => showHelp(SECTIONS));
      break;
    case 'clear':
      clearOutput();
      await runLocked(() => showWelcome(SECTIONS));
      break;
    case 'reboot':
      cmdReboot(SECTIONS);
      break;
    case 'git': {
      if (args[0] === 'log') {
        await runLocked(() => printOutput(cmdGitLog()));
        break;
      }
      if (args[0] === 'status') {
        await runLocked(() => printOutput(cmdGitStatus()));
        break;
      }
      await runLocked(() =>
        printOutput([{ text: `git: '${args[0] ?? ''}' is not a git command`, style: 'error' }]),
      );
      break;
    }
    case 'sudo':
      await runLocked(() => cmdSudo(args, () => cmdReboot(SECTIONS)));
      break;
    case 'ping':
      await runLocked(() => cmdPing(args));
      break;
    case 'coffee':
      await runLocked(() => cmdCoffee());
      break;
    case 'npm':
      await runLocked(() => cmdNpmInstall());
      break;
    case 'hack': {
      inputState.locked = true;
      inputLineEl.style.display = 'none';
      const cleanup = await cmdHack();
      activeCleanup = () => {
        cleanup();
        inputLineEl.style.display = 'flex';
        inputState.locked = false;
        scrollToBottom();
      };
      break;
    }
    default:
      await runLocked(() => printOutput(cmdUnknown(cmd)));
      break;
  }
}

// ─── Boot & init ──────────────────────────────────────────────────────────────

initPrompt(config);

void runBoot(config, async () => {
  await showWelcome(SECTIONS);
  inputState.locked = false;
  initInput(
    config,
    SECTIONS,
    BUILTIN_NAMES,
    (raw) => {
      void execute(raw);
    },
    () => cmdReboot(SECTIONS),
  );
});
