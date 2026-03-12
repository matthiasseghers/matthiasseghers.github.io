// ─── Terminal output ──────────────────────────────────────────────────────────

export type LineStyle = 'normal' | 'bright' | 'dim' | 'error' | 'warn' | 'echo';

export interface Line {
  text: string;
  style?: LineStyle;
  html?: boolean; // when true, text is rendered as innerHTML (for links)
  delayMs?: number; // per-line intent delay — see engine.ts printOutput
}

// ─── Command types ────────────────────────────────────────────────────────────

/** Standard command — returns lines, never calls printOutput itself */
export type CommandFn = (args: string[]) => Line[] | Promise<Line[]>;

/**
 * Shape every command module must export.
 * Enforced by TypeScript — forgetting `description` is a compile error.
 *
 * Usage:
 *   import type { CommandModule } from '../../types';
 *   export const command: CommandModule = { description: '...', fn: myFn };
 *
 * Note: content sections use the Section interface instead — they have
 * additional metadata (data, render) and are registered differently.
 */
export interface CommandModule {
  description: string;
  fn: CommandFn;
}

// ─── Section (content commands with metadata) ─────────────────────────────────

export interface Section {
  command: string;
  description: string;
  render: () => Line[];
  data?: unknown; // raw source data — used by ls -l for file size display
}

// ─── Data shapes (validated against JSON data files) ─────────────────────────

export interface AboutData {
  name: string;
  title: string;
  company: string;
  companyUrl: string;
  location: string;
  bio: string[];
}

export interface ExperienceEntry {
  company: string;
  companyUrl?: string;
  role: string;
  from: string;
  to: string; // "Present" or a year
  highlights: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  url?: string;
  tech: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface LinkEntry {
  label: string;
  url: string;
  description?: string;
}

// ─── Config shape ─────────────────────────────────────────────────────────────

export interface Config {
  prompt: string;
  hostname: string;
  username: string;
  theme: string;
  bootSpeed: 'slow' | 'normal' | 'fast';
  sounds: boolean;
  cursorBlinkMs: number;
  baudRate: number;
}
