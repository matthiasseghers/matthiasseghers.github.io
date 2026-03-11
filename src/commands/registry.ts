import type { CommandFn, Section } from '../types';

// ─── Content sections ─────────────────────────────────────────────────────────
import { aboutSection }      from './content/about';
import { experienceSection } from './content/experience';
import { projectsSection }   from './content/projects';
import { skillsSection }     from './content/skills';
import { linksSection }      from './content/links';

// ─── System commands ──────────────────────────────────────────────────────────
import { cat }      from './system/cat';
import { date }     from './system/date';
import { echo }     from './system/echo';
import { env }      from './system/env';
import { git }      from './system/git';
import { help }     from './system/help';
import { ls }       from './system/ls';
import { man }      from './system/man';
import { neofetch } from './system/neofetch';
import { pwd }      from './system/pwd';
import { uname }    from './system/uname';
import { which }    from './system/which';
import { whoami }   from './system/whoami';

// ─── Easter eggs ──────────────────────────────────────────────────────────────
import { cd }         from './easter-eggs/cd';
import { chmod }      from './easter-eggs/chmod';
import { coffee }     from './easter-eggs/coffee';
import { exit }       from './easter-eggs/exit';
import { npmInstall } from './easter-eggs/npm-install';
import { ping }       from './easter-eggs/ping';
import { ps }         from './easter-eggs/ps';
import { rm }         from './easter-eggs/rm';
import { unknown }    from './easter-eggs/unknown';

// ─── Special commands ─────────────────────────────────────────────────────────
// These can't return Line[] so they don't fit the standard registry.
// Imported here so main.ts never needs to know individual command files exist.
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

// ─── Standard registry ────────────────────────────────────────────────────────

export const registry = new Map<string, CommandFn>([
  // Content
  ...SECTIONS.map((s): [string, CommandFn] => [s.command, () => s.render()]),

  // System
  ['ls',       (args) => ls(args, SECTIONS)],
  ['cat',      (args) => cat(args, SECTIONS)],
  ['help',     ()     => help(SECTIONS)],
  ['whoami',   whoami],
  ['date',     date],
  ['pwd',      pwd],
  ['uname',    uname],
  ['echo',     echo],
  ['env',      env],
  ['which',    which],
  ['man',      man],
  ['neofetch', neofetch],
  ['git',      git],

  // Easter eggs
  ['ping',   ping],
  ['rm',     rm],
  ['cd',     cd],
  ['exit',   exit],
  ['coffee', coffee],
  ['npm',    npmInstall],
  ['ps',     ps],
  ['chmod',  chmod],
]);

// ─── Special commands ─────────────────────────────────────────────────────────
// Exported as a plain object so main.ts can call special.matrix() and
// special.sudo() without importing from individual command files directly.

export const special = {
  matrix,
  sudo,
};

// ─── Fallback ─────────────────────────────────────────────────────────────────

export { unknown };