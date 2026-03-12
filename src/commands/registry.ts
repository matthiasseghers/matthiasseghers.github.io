import type { CommandFn, Section } from '../types';

// ─── Content sections ─────────────────────────────────────────────────────────
import { aboutSection } from './content/about';
import { experienceSection } from './content/experience';
import { projectsSection } from './content/projects';
import { skillsSection } from './content/skills';
import { linksSection } from './content/links';

// ─── System commands ──────────────────────────────────────────────────────────
// Simple commands export `command: CommandModule` — description and fn together.
// Commands that need runtime context (ls, cat, help) export factory functions.
import { command as date } from './system/date';
import { command as echo } from './system/echo';
import { command as env } from './system/env';
import { command as git } from './system/git';
import { command as man } from './system/man';
import { command as neofetch } from './system/neofetch';
import { command as pwd } from './system/pwd';
import { command as uname } from './system/uname';
import { command as which } from './system/which';
import { command as whoami } from './system/whoami';
import { makeLs } from './system/ls';
import { makeCat } from './system/cat';
import { makeHelp } from './system/help';

// ─── Easter eggs ──────────────────────────────────────────────────────────────
// No CommandModule export — intentionally hidden from help.
import { cd } from './easter-eggs/cd';
import { chmod } from './easter-eggs/chmod';
import { coffee } from './easter-eggs/coffee';
import { exit } from './easter-eggs/exit';
import { npmInstall } from './easter-eggs/npm-install';
import { ping } from './easter-eggs/ping';
import { ps } from './easter-eggs/ps';
import { rm } from './easter-eggs/rm';
import { unknown } from './easter-eggs/unknown';

// ─── Special commands ─────────────────────────────────────────────────────────
import { matrix } from './easter-eggs/matrix';
import { sudo } from './easter-eggs/sudo';

// ─── Sections array ───────────────────────────────────────────────────────────

export const SECTIONS: Section[] = [
  aboutSection,
  experienceSection,
  projectsSection,
  skillsSection,
  linksSection,
];

// ─── Context-injected commands ────────────────────────────────────────────────
// Built once here with SECTIONS injected — descriptions and fns come from the
// returned CommandModule so there's no duplication.

const lsCmd = makeLs(SECTIONS);
const catCmd = makeCat(SECTIONS);

// ─── Descriptions ─────────────────────────────────────────────────────────────
// Derived entirely from CommandModule.description — no manual strings.
// Order here controls order in help output.

export const descriptions = new Map<string, string>([
  // Content — from Section.description
  ...SECTIONS.map((s): [string, string] => [s.command, s.description]),

  // System — from CommandModule.description
  ['git', git.description],
  ['neofetch', neofetch.description],
  ['man', man.description],
  ['ls', lsCmd.description],
  ['cat', catCmd.description],
  ['whoami', whoami.description],
  ['date', date.description],
  ['pwd', pwd.description],
  ['echo', echo.description],
  ['env', env.description],
  ['which', which.description],
  ['uname', uname.description],

  // Meta — live in main.ts, no command file to derive from
  ['clear', 'Clear the terminal'],
  ['reboot', 'Replay the boot sequence'],
  ['help', 'Show this message'],
]);

const helpCmd = makeHelp(descriptions);

// ─── Standard registry ────────────────────────────────────────────────────────

export const registry = new Map<string, CommandFn>([
  // Content
  ...SECTIONS.map((s): [string, CommandFn] => [s.command, () => s.render()]),

  // System
  ['ls', lsCmd.fn],
  ['cat', catCmd.fn],
  ['help', helpCmd.fn],
  ['git', git.fn],
  ['neofetch', neofetch.fn],
  ['man', man.fn],
  ['whoami', whoami.fn],
  ['date', date.fn],
  ['pwd', pwd.fn],
  ['uname', uname.fn],
  ['echo', echo.fn],
  ['env', env.fn],
  ['which', which.fn],

  // Easter eggs — not in descriptions, won't appear in help
  ['ping', ping],
  ['rm', rm],
  ['cd', cd],
  ['exit', exit],
  ['coffee', coffee],
  ['npm', npmInstall],
  ['ps', ps],
  ['chmod', chmod],
]);

// ─── Special commands ─────────────────────────────────────────────────────────

export const special = {
  hack: matrix,
  sudo,
};

// ─── Fallback ─────────────────────────────────────────────────────────────────

export { unknown };
