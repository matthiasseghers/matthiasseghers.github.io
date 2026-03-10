import type { Line } from '../types';
import type { Config } from '../types';
import cfg from '../config.json';

const _config = cfg as Config;

// ─── Baud rate / serial mode ──────────────────────────────────────────────────

/** True when baudRate < 115200 — enables line-by-line animation + input lock */
export function isSerialMode(): boolean {
  return _config.baudRate < 115_200;
}

/** ms per line derived from baud rate (assumes ~60 chars/line, 10 bits/char) */
export function baudDelay(): number {
  return Math.round(600_000 / _config.baudRate);
}

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

export function printLines(lines: Line[]): void {
  lines.forEach(printLine);
}

// ─── Print lines one-by-one with a delay between each ────────────────────────

export async function printLinesAnimated(lines: Line[], delayMs = baudDelay()): Promise<void> {
  for (const line of lines) {
    printLine(line);
    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
  }
}

// ─── Baud-rate aware output: animates in serial mode, instant otherwise ───────

export async function printOutput(lines: Line[]): Promise<void> {
  if (isSerialMode()) {
    await printLinesAnimated(lines);
  } else {
    printLines(lines);
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
