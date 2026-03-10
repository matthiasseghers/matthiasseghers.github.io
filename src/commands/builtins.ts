import type { Section, Line } from '../types';
import { printLine, printOutput, clearOutput } from '../terminal/engine';
import { runBoot } from '../terminal/boot';
import { showWelcome, ASCII_M } from '../terminal/welcome';
import cfg from '../config.json';
import type { Config } from '../types';
import aboutData from '../data/about.json';
import type { AboutData } from '../types';

const about = aboutData as AboutData;

const config = cfg as Config;

// ─── File size helper ─────────────────────────────────────────────────────────

const getSize = (data: unknown): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(data)).length;
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}K`;
};

// ─── help ─────────────────────────────────────────────────────────────────────

export async function showHelp(sections: Section[]): Promise<void> {
  const B: Line = { text: '\u00A0' };

  // Find non-about sections to list dynamically; about is shown manually as combined entry
  const otherSections = sections.filter((s) => s.command !== 'about');

  await printOutput([
    { text: 'Commands:', style: 'bright' },
    B,
    { text: `about / whoami  Who am I` },
    ...otherSections.map((s) => ({ text: `${s.command.padEnd(16)}${s.description}` }) as Line),
    B,
    { text: 'git log         How I got here' },
    { text: 'neofetch        System info, neofetch-style' },
    { text: 'echo            Just try it' },
    { text: 'clear           Clear the terminal' },
    { text: 'reboot          Replay the boot sequence' },
    { text: 'date            Current date and time' },
    { text: 'help            Show this message' },
    B,
    {
      text: 'Tab to autocomplete  ·  ↑↓ for history  ·  Ctrl+L to clear  ·  Ctrl+C to cancel',
      style: 'dim',
    },
    B,
    { text: 'not all commands are listed here', style: 'dim' },
  ]);
}

// ─── neofetch ─────────────────────────────────────────────────────────────────

export function cmdNeofetch(): Line[] {
  const PAD = 18;
  const sep = '─'.repeat(config.username.length + config.hostname.length + 1);

  const infoLines: string[] = [
    `<span class="bright">${config.username}</span><span class="dim">@</span><span class="bright">${config.hostname}</span>`,
    `<span class="dim">${sep}</span>`,
    `<span class="dim">OS:   </span> MATTHIAS-OS 2.6.0 LTS`,
    `<span class="dim">Role: </span> ${about.title}`,
    `<span class="dim">Co:   </span> ${about.company}  ·  ${about.location}`,
    `<span class="dim">Shell:</span> ${config.hostname} v1.0`,
  ];

  const artLines = ASCII_M;
  const count = Math.max(artLines.length, infoLines.length);
  const lines: Line[] = [];

  for (let i = 0; i < count; i++) {
    const art = (artLines[i] ?? '').padEnd(PAD);
    const inf = infoLines[i] ?? '';
    lines.push({ text: `<span class="bright">${art}</span>${inf}`, html: true });
  }
  lines.push({ text: '\u00A0' });
  return lines;
}

export function cmdWhoami(): Line[] {
  return [
    {
      text: `${config.username} \u2014 ${about.title.toLowerCase()}, coffee dependent, occasionally ships things`,
    },
  ];
}

export function cmdEcho(args: string[]): Line[] {
  return [{ text: args.join(' ') || '\u00A0' }];
}

export function cmdDate(): Line[] {
  return [{ text: new Date().toString() }];
}

export function cmdPwd(): Line[] {
  return [{ text: `/home/${config.username}` }];
}

export function cmdLs(sections: Section[], args: string[] = []): Line[] {
  const flags = args.filter((a) => a.startsWith('-'));
  const operands = args.filter((a) => !a.startsWith('-'));

  if (operands.length > 0) {
    return operands.map((o) => ({
      text: `ls: ${o}: No such file or directory`,
      style: 'error' as const,
    }));
  }

  const isLong = flags.some((f) => f === '-la' || f === '-a');
  if (isLong) {
    const sizes = sections.map((s) => getSize(s.data ?? {}));
    const maxLen = Math.max(...sizes.map((s) => s.length));
    return [
      { text: 'total 42', style: 'dim' },
      ...sections.map((s, i) => ({
        text: `-rwxr-xr-x  guest  ${(sizes[i] ?? '').padStart(maxLen)}  ${s.command}*`,
        style: 'bright' as const,
      })),
    ];
  }

  return [{ text: sections.map((s) => s.command + '*').join('    '), style: 'bright' }];
}

export function cmdCat(args: string[], sections: Section[]): Line[] {
  if (args.length === 0) return [{ text: 'cat: missing operand', style: 'error' }];
  const raw = args[0] ?? '';
  const name = raw.replace(/^\.\//, '');

  // Easter egg: cat /etc/passwd
  if (name === '/etc/passwd' || name === 'etc/passwd') {
    return [
      {
        text: `${config.username}:x:1000:1000:${about.name}:/home/${config.username}:/bin/coffee`,
        style: 'dim',
      },
    ];
  }

  const section = sections.find((s) => s.command === name);
  if (section) return section.render();
  return [{ text: `cat: ${raw}: No such file or directory`, style: 'error' }];
}

export function cmdUname(): Line[] {
  return [{ text: `MATTHIAS-OS 26.0 #1 SMP Backend-Optimised x86_64 GNU/${config.username}` }];
}

export function cmdWhich(args: string[]): Line[] {
  if (!args.length) return [{ text: 'which: missing argument', style: 'error' }];
  const target = (args[0] ?? '').toLowerCase();
  if (target === 'coffee') return [{ text: '/usr/local/bin/coffee' }];
  const known = [
    'node',
    'npm',
    'git',
    'ls',
    'cat',
    'echo',
    'pwd',
    'env',
    'bash',
    'sh',
    'zsh',
    'python',
    'php',
  ];
  if (known.includes(target)) return [{ text: `/usr/bin/${target}` }];
  return [{ text: `which: ${args[0] ?? ''}: not found`, style: 'error' }];
}

export function cmdEnv(): Line[] {
  return [
    { text: `USER=${config.username}` },
    { text: `HOME=/home/${config.username}` },
    { text: `SHELL=/bin/coffee` },
    { text: `EDITOR=vscode` },
    { text: `LANG=TypeScript` },
    { text: `NODE_ENV=production` },
    { text: `COFFEE_LEVEL=critical` },
    { text: `HOSTNAME=${config.hostname}` },
    { text: `TERM=xterm-256color` },
  ];
}

// ─── man ──────────────────────────────────────────────────────────────────────

export function cmdMan(args: string[]): Line[] {
  const subject = (args[0] ?? '').toLowerCase();
  if (subject !== 'matthias') {
    if (!subject) return [{ text: 'What manual page do you want?', style: 'error' }];
    return [{ text: `man: no entry for ${args[0]}`, style: 'error' }];
  }

  const header = `MATTHIAS(1)          User Commands          MATTHIAS(1)`;
  const D = (text: string): Line => ({ text });
  const d = (text: string): Line => ({ text, style: 'dim' });
  const B: Line = { text: '\u00A0' };

  return [
    { text: header, style: 'bright' },
    B,
    { text: 'NAME', style: 'bright' },
    D(`       ${config.username} \u2014 ${about.title.toLowerCase()}, occasional overthinker`),
    B,
    { text: 'SYNOPSIS', style: 'bright' },
    D(`       ${config.username} [--coffee] [--remote] [--deadline approaching]`),
    B,
    { text: 'DESCRIPTION', style: 'bright' },
    D(`       ${about.name} is a ${about.location}-based ${about.title.toLowerCase()} with`),
    D(`       over a decade of experience turning coffee into code.`),
    B,
    D(`       Performs best in environments with clear problems,`),
    D(`       good tooling, and reasonable deadlines.`),
    B,
    { text: 'OPTIONS', style: 'bright' },
    D(`       --coffee`),
    d(`              Required. Not optional. See DEPENDENCIES.`),
    B,
    D(`       --remote`),
    d(`              Functions normally. Possibly better.`),
    B,
    D(`       --deadline approaching`),
    d(`              Activates focus mode. Do not disturb.`),
    B,
    { text: 'BUGS', style: 'bright' },
    D(`       Occasionally overengineers simple solutions.`),
    D(`       Known to start side projects at 11pm.`),
    B,
    { text: 'DEPENDENCIES', style: 'bright' },
    D(`       coffee >= 3.0.0`),
    D(`       good-problem (any version)`),
    B,
    { text: 'SEE ALSO', style: 'bright' },
    D(`       about(1), experience(1), projects(1)`),
    B,
    { text: header, style: 'bright' },
  ];
}

// ─── Reboot ───────────────────────────────────────────────────────────────────

export function cmdReboot(sections: Section[]): void {
  printLine({ text: 'System going down for reboot now...', style: 'warn' });

  const inputLine = document.getElementById('input-line') as HTMLElement;
  inputLine.style.display = 'none';

  setTimeout(() => {
    clearOutput();
    void runBoot(config, async () => {
      await showWelcome(sections);
    });
  }, 1000);
}
