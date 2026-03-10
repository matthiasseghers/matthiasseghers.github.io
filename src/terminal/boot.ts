import type { Config } from '../types';
import { printLine, clearOutput, scrollToBottom } from './engine';
import { postBeep } from './audio';

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

// Speed multipliers applied to all delays based on config.bootSpeed
const SPEED: Record<Config['bootSpeed'], number> = {
  slow: 1.8,
  normal: 1.0,
  fast: 0.3,
};

function delay(ms: number, speed: Config['bootSpeed']): Promise<void> {
  return sleep(ms * SPEED[speed]);
}

// ─── Boot lines ───────────────────────────────────────────────────────────────

interface BootLine {
  text: string;
  pause: number; // delay BEFORE this line prints
  style?: 'bright' | 'dim';
  dots?: boolean;
  dotCount?: number; // how many dots to append (default 3)
  dotInterval?: number; // ms between each dot before speed multiplier (default 90)
  postPause?: number; // extra hang AFTER dots finish
  html?: boolean; // when true, text rendered as innerHTML (for inline spans)
}

function buildBootLines(cfg: Config): BootLine[] {
  return [
    // ── Header — fast, establishes identity immediately ──────────────────────
    { text: `Seghers Systems Ltd.  MATTHIAS/BIOS v34.0.0`, pause: 60, style: 'bright' },
    { text: `Copyright (C) 1992-2026  All Rights Reserved`, pause: 30 },
    { text: `BIOS Date: 07/03  Revision: 34`, pause: 30 },
    { text: ``, pause: 20 },
    // ── Hardware — fast, just reporting facts ─────────────────────────────────
    { text: `CPU: Matthias-9000 @ 3.14 GHz`, pause: 40 },
    { text: `FPU: CoffeeUnit/\u221e           [loaded automatically]`, pause: 40 },
    { text: `Memory Test: 8192 MB OK`, pause: 900 }, // machine is actually counting
    { text: `L1 Cache: 512K  L2 Cache: 4MB  L3 Cache: Vibes`, pause: 40 },
    { text: ``, pause: 20 },
    // ── DMI verify — dots crawl, then hang. real machines took forever here ───
    {
      text: `Verifying DMI Pool Data`,
      pause: 60,
      dots: true,
      dotCount: 13,
      dotInterval: 90,
      postPause: 500,
    },
    { text: ``, pause: 20 },
    // ── PCI scan — fast, three lines in quick succession ─────────────────────
    { text: `PCI bus scan:`, pause: 30 },
    { text: `  [8086:0001] Creativity Engine         IRQ 7   ... ok`, pause: 50 },
    { text: `  [8086:0002] Problem Solving Unit      IRQ 11  ... ok`, pause: 50 },
    {
      text: `  [8086:0003] Imposter Syndrome Module  IRQ \u2014   ... not found`,
      pause: 50,
      style: 'dim',
    },
    { text: ``, pause: 20 },
    // ── Storage — each drive spins up separately, medium beat between them ────
    { text: `Detecting storage:`, pause: 30 },
    {
      text: `  Pri Master : EXPERIENCE    512GB  LBA  [<span class="ok">OK</span>]`,
      pause: 240,
      html: true,
    },
    {
      text: `  Pri Slave  : PROJECTS      256GB  LBA  [<span class="ok">OK</span>]`,
      pause: 240,
      html: true,
    },
    {
      text: `  Sec Master : SKILLS        128GB  LBA  [<span class="ok">OK</span>]`,
      pause: 240,
      html: true,
    },
    { text: `  Sec Slave  : REGRETS         0GB  LBA  [NO RECOVERABLE DATA]`, pause: 240 },
    { text: ``, pause: 20 },
    // ── Network — fast ────────────────────────────────────────────────────────
    { text: `Network:`, pause: 30 },
    { text: `  eth0: link up 1000Mbps \u2192 ${cfg.hostname}`, pause: 40 },
    { text: ``, pause: 20 },
    // ── Loading OS — dramatic centrepiece, slow dots then hang ────────────────
    {
      text: `Loading MATTHIAS-OS`,
      pause: 80,
      style: 'bright',
      dots: true,
      dotCount: 22,
      dotInterval: 110,
      postPause: 350,
    },
    { text: ``, pause: 20 },
    // ── Warnings — each one lands separately ─────────────────────────────────
    {
      text: `  <span class="warn">WARNING</span>: 47 browser tabs detected in last session`,
      pause: 160,
      html: true,
    },
    {
      text: `  <span class="warn">WARNING</span>: README.md last updated: a while ago`,
      pause: 160,
      html: true,
    },
    {
      text: `  <span class="warn">WARNING</span>: Side project count exceeds stable limit`,
      pause: 160,
      html: true,
    },
    {
      text: `  <span class="warn">WARNING</span>: All warnings ignored successfully`,
      pause: 160,
      html: true,
    },
    { text: ``, pause: 20 },
  ];
}

// ─── Boot runner ──────────────────────────────────────────────────────────────

export async function runBoot(cfg: Config, onReady: () => Promise<void>): Promise<void> {
  const inputLine = document.getElementById('input-line') as HTMLElement;
  inputLine.style.display = 'none';

  // Easter egg: pressing any key during boot skips the final pause
  let _skipPressed = false;
  const skipHandler = (e: KeyboardEvent) => {
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
    _skipPressed = true;
  };
  document.addEventListener('keydown', skipHandler);

  // Run the full boot sequence
  for (const entry of buildBootLines(cfg)) {
    await delay(entry.pause, cfg.bootSpeed);

    if (entry.dots) {
      const el = printLine({ text: entry.text, style: entry.style });
      const n = entry.dotCount ?? 3;
      const interval = entry.dotInterval ?? 90;
      for (let i = 0; i < n; i++) {
        await delay(interval, cfg.bootSpeed);
        el.textContent += '.';
      }
      if (entry.postPause) await delay(entry.postPause, cfg.bootSpeed);
    } else {
      const text = entry.text === '' ? '\u00A0' : entry.text;
      printLine({ text, style: entry.style, html: entry.html });
    }
  }

  document.removeEventListener('keydown', skipHandler);

  // Auto-continue after 800ms — or immediately if a key was pressed during boot
  await new Promise<void>((resolve) => {
    if (_skipPressed) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, 800 * SPEED[cfg.bootSpeed]);
    const handler = (e: KeyboardEvent) => {
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
      clearTimeout(timer);
      document.removeEventListener('keydown', handler);
      resolve();
    };
    document.addEventListener('keydown', handler);
  });

  if (cfg.sounds) {
    postBeep();
  }

  clearOutput();
  scrollToBottom();

  await onReady();

  inputLine.style.display = 'flex';
  scrollToBottom();
}
