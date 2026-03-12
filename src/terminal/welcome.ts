import type { Line } from '../types';
import { printBlank, printLine, printOutput } from './engine';
import figlet from 'figlet';
import ansiShadow from 'figlet/importable-fonts/ANSI Shadow.js';
import aboutData from '../data/about.json';
import type { AboutData } from '../types';

const about = aboutData as AboutData;

// ─── ASCII banner (figlet ANSI Shadow, generated once at module load) ─────────

figlet.parseFont('ANSI Shadow', ansiShadow);

export const ASCII_NAME: Line[] = figlet
  .textSync(about.name.split(' ')[0] ?? about.name, { font: 'ANSI Shadow' })
  .split('\n')
  .map((text) => ({ text, style: 'bright' as const }));

export const ASCII_M: string[] = figlet.textSync('M', { font: 'ANSI Shadow' }).split('\n');

export const RULE = '─'.repeat(54);

export async function showWelcome(): Promise<void> {
  await printOutput(ASCII_NAME);
  printBlank();
  printLine({ text: RULE, style: 'dim' });
  printLine({ text: `${about.title} - ${about.location}` });
  printLine({ text: "Type 'help' to get started.", style: 'dim' });
  printLine({ text: RULE, style: 'dim' });
}
