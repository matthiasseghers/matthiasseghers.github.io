import type { CommandFn, Section } from '../types';

// ─── Content sections ─────────────────────────────────────────────────────────
import { aboutSection } from './content/about';
import { experienceSection } from './content/experience';
import { projectsSection } from './content/projects';
import { skillsSection } from './content/skills';
import { linksSection } from './content/links';

// ─── System commands ──────────────────────────────────────────────────────────
import { cat, description as catDesc } from './system/cat';
import { date, description as dateDesc } from './system/date';
import { echo, description as echoDesc } from './system/echo';
import { env, description as envDesc } from './system/env';
import { git, description as gitDesc } from './system/git';
import { help } from './system/help';
import { ls, description as lsDesc } from './system/ls';
import { man, description as manDesc } from './system/man';
import { neofetch, description as neofetchDesc } from './system/neofetch';
import { pwd, description as pwdDesc } from './system/pwd';
import { uname, description as unameDesc } from './system/uname';
import { which, description as whichDesc } from './system/which';
import { whoami, description as whoamiDesc } from './system/whoami';

// ─── Easter eggs ──────────────────────────────────────────────────────────────
// No descriptions exported — these are intentionally hidden from help.
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

// ─── Descriptions ─────────────────────────────────────────────────────────────
// Controls what appears in `help`. Commands NOT listed here are hidden.
// To add a new visible command: export a description from its file and add here.
// Order here is the order they appear in help output.

export const descriptions = new Map<string, string>([
  // Content — pulled from Section.description, order matches SECTIONS
  ...SECTIONS.map((s): [string, string] => [s.command, s.description]),

  // System — pulled from each command file
  ['git', gitDesc],
  ['neofetch', neofetchDesc],
  ['man', manDesc],
  ['ls', lsDesc],
  ['cat', catDesc],
  ['whoami', whoamiDesc],
  ['date', dateDesc],
  ['pwd', pwdDesc],
  ['echo', echoDesc],
  ['env', envDesc],
  ['which', whichDesc],
  ['uname', unameDesc],

  // Meta — clear and reboot live in main.ts, help describes itself
  ['clear', 'Clear the terminal'],
  ['reboot', 'Replay the boot sequence'],
  ['help', 'Show this message'],
]);

// ─── Standard registry ────────────────────────────────────────────────────────
// To add a new command: import it above, add to registry below, and add to
// descriptions above if it should appear in help.

export const registry = new Map<string, CommandFn>([
  // Content
  ...SECTIONS.map((s): [string, CommandFn] => [s.command, () => s.render()]),

  // System
  ['ls', (args) => ls(args, SECTIONS)],
  ['cat', (args) => cat(args, SECTIONS)],
  ['help', () => help(descriptions)],
  ['whoami', whoami],
  ['date', date],
  ['pwd', pwd],
  ['uname', uname],
  ['echo', echo],
  ['env', env],
  ['which', which],
  ['man', man],
  ['neofetch', neofetch],
  ['git', git],

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
