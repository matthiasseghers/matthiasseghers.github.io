// ─── Terminal output ──────────────────────────────────────────────────────────

export type LineStyle = 'normal' | 'bright' | 'dim' | 'error' | 'warn' | 'echo';

export interface Line {
  text: string;
  style?: LineStyle;
  html?: boolean; // when true, text is rendered as innerHTML (for links)
}

// ─── Section (content + command, registered in registry.ts) ──────────────────

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
