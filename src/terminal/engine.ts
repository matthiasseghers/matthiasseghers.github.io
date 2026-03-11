import type { Line } from '../types';
import { config } from '../config';

// ─── Baud rate / serial mode ──────────────────────────────────────────────────

/** True when baudRate < 115200 — enables line-by-line animation + input lock */
export function isSerialMode(): boolean {
  return config.baudRate < 115_200;
}

/** ms per line derived from baud rate (assumes ~60 chars/line, 10 bits/char) */
export function baudDelay(): number {
  return Math.round(600_000 / config.baudRate);
}

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const outputEl = document.getElementById('output') as HTMLDivElement;
const terminalEl = document.getElementById('terminal') as HTMLDivElement;

// ─── Scroll ───────────────────────────────────────────────────────────────────

export function scrollToBottom(): void {
  terminalEl.scrollTop = terminalEl.scrollHeight;
}

// ─── Print a single Line ──────────────────────────────────────────────────────

export function printLine(line: Line): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'line' + (line.style && line.style !== 'normal' ? ` ${line.style}` : '');

  if (line.html) {
    div.innerHTML = line.text;
  } else {
    div.textContent = line.text;
  }

  outputEl.appendChild(div);
  scrollToBottom();
  return div;
}

// ─── Print multiple Lines ─────────────────────────────────────────────────────
// Handles two independent delay systems:
//
//   line.delayMs  — per-line intent (e.g. ping timing, npm install steps)
//   baudDelay()   — global baseline from config (simulates slow serial terminal)
//
// Rule: take whichever is longer, so neither overrides the other.
// Both undefined/0 → prints instantly.

export async function printOutput(lines: Line[]): Promise<void> {
  for (const line of lines) {
    const perLine = line.delayMs ?? 0;
    const baud = isSerialMode() ? baudDelay() : 0;
    const delay = Math.max(perLine, baud);

    if (delay > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, delay));
    }

    printLine(line);
  }
}

// ─── Print a blank spacer line ────────────────────────────────────────────────

export function printBlank(): void {
  printLine({ text: '\u00A0' }); // non-breaking space gives the line natural height
}

// ─── Print the echoed command (what the user typed) ───────────────────────────

export function printEcho(prompt: string, input: string): void {
  printLine({ text: `${prompt} ${input}`, style: 'echo' });
}

// ─── Clear all output ─────────────────────────────────────────────────────────

export function clearOutput(): void {
  outputEl.innerHTML = '';
}

// ─── Show / hide the input line ───────────────────────────────────────────────
// Commands and main.ts should use these instead of touching the DOM directly.

const inputLineEl = document.getElementById('input-line') as HTMLElement;

export function showInputLine(): void {
  inputLineEl.style.display = 'flex';
}

export function hideInputLine(): void {
  inputLineEl.style.display = 'none';
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

const RULE = '─'.repeat(40);

export function sectionHeader(title: string): Line[] {
  return [
    { text: title, style: 'bright' },
    { text: RULE, style: 'dim' },
  ];
}

export function indent(text: string, spaces = 0): string {
  return ' '.repeat(spaces) + text;
}

export function linkLine(label: string, url: string, description?: string): Line {
  const display = description ?? url;
  return {
    text: `${label.padEnd(12)}→  <a href="${url}" target="_blank" rel="noopener">${display}</a>`,
    html: true,
  };
}
