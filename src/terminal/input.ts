import type { Config } from '../types';
import { printEcho, printLine, printBlank, clearOutput } from './engine';
import { keyClick } from './audio';

// ─── Input state ──────────────────────────────────────────────────────────────

interface InputState {
  current: string;
  history: string[];
  historyIndex: number;
  cursorPos: number;
  locked: boolean;
}

export const inputState: InputState = {
  current: '',
  history: [],
  historyIndex: -1,
  cursorPos: 0,
  locked: true,
};

export function lockInput(): void {
  inputState.locked = true;
}

export function unlockInput(): void {
  inputState.locked = false;
}

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const promptEl  = document.getElementById('prompt')        as HTMLSpanElement;
const displayEl = document.getElementById('input-display') as HTMLSpanElement;

// ─── Render current input to DOM ──────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderInput(): void {
  const { current, cursorPos } = inputState;
  const before = escapeHtml(current.slice(0, cursorPos));
  const at     = escapeHtml(current[cursorPos] ?? ' ');
  const after  = escapeHtml(current.slice(cursorPos + 1));
  displayEl.innerHTML = `${before}<span class="cursor-block">${at}</span>${after}`;
}

// ─── Set prompt text and cursor speed from config ─────────────────────────────

export function initPrompt(cfg: Config): void {
  promptEl.textContent = cfg.prompt;
  document.documentElement.style.setProperty('--cursor-blink-ms', `${cfg.cursorBlinkMs}ms`);
  console.log('initPrompt called', cfg.cursorBlinkMs);
}

// ─── Tab completion ───────────────────────────────────────────────────────────
// Receives a flat list of all command names — built once in main.ts from
// registry.keys() and passed in. No deduplication needed here.

export function handleTab(commands: string[]): void {
  const input = inputState.current.trim().toLowerCase();
  if (!input) return;

  const matches = commands.filter((c) => c.startsWith(input));

  if (matches.length === 1) {
    inputState.current = matches[0] ?? '';
    inputState.cursorPos = inputState.current.length;
    renderInput();
  } else if (matches.length > 1) {
    printBlank();
    printLine({ text: matches.join('    '), style: 'dim' });
    printBlank();
  }
}

// ─── Keyboard handler ─────────────────────────────────────────────────────────

export function initInput(
  cfg: Config,
  commands: string[],
  executeCommand: (raw: string) => void,
): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (inputState.locked) return;

    if (e.ctrlKey) {
      if (e.key === 'l') {
        e.preventDefault();
        clearOutput();
        executeCommand('__welcome__');
      } else if (e.key === 'c') {
        e.preventDefault();
        printLine({ text: `${cfg.prompt} ${inputState.current}^C`, style: 'echo' });
        inputState.current = '';
        inputState.cursorPos = 0;
        renderInput();
      }
      return;
    }

    switch (e.key) {
      case 'Enter': {
        let raw = inputState.current.trim();

        const lastCmd  = inputState.history[0] ?? '';
        const lastWord = lastCmd.trim().split(/\s+/).pop() ?? '';

        const expanded   = raw.replace(/!!/g, lastCmd).replace(/!\$/g, lastWord);
        const wasExpanded = expanded !== raw;
        raw = expanded;

        if (cfg.sounds) keyClick();
        if (raw.trim()) {
          inputState.history.unshift(raw);
          inputState.historyIndex = -1;
        }

        if (wasExpanded) {
          printEcho(cfg.prompt, inputState.current.trim());
          printLine({ text: raw, style: 'dim' });
        } else {
          printEcho(cfg.prompt, raw);
        }

        executeCommand(raw);
        inputState.current = '';
        inputState.cursorPos = 0;
        renderInput();
        break;
      }

      case 'Backspace':
        e.preventDefault();
        if (cfg.sounds) keyClick();
        if (inputState.cursorPos > 0) {
          inputState.current =
            inputState.current.slice(0, inputState.cursorPos - 1) +
            inputState.current.slice(inputState.cursorPos);
          inputState.cursorPos--;
        }
        renderInput();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (inputState.cursorPos > 0) inputState.cursorPos--;
        renderInput();
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (inputState.cursorPos < inputState.current.length) inputState.cursorPos++;
        renderInput();
        break;

      case 'Tab':
        e.preventDefault();
        handleTab(commands);
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (inputState.historyIndex < inputState.history.length - 1) {
          inputState.historyIndex++;
          inputState.current = inputState.history[inputState.historyIndex] ?? '';
          inputState.cursorPos = inputState.current.length;
          renderInput();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (inputState.historyIndex > 0) {
          inputState.historyIndex--;
          inputState.current = inputState.history[inputState.historyIndex] ?? '';
          inputState.cursorPos = inputState.current.length;
        } else {
          inputState.historyIndex = -1;
          inputState.current = '';
          inputState.cursorPos = 0;
        }
        renderInput();
        break;

      default:
        if (e.key.length === 1 && !e.metaKey && !e.altKey) {
          if (cfg.sounds) keyClick();
          inputState.current =
            inputState.current.slice(0, inputState.cursorPos) +
            e.key +
            inputState.current.slice(inputState.cursorPos);
          inputState.cursorPos++;
          renderInput();
        }
    }
  });
}