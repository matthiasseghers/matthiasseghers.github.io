import type { Line } from '../types';

// ─── Commit data ──────────────────────────────────────────────────────────────

interface Commit {
  hash: string;
  date: string;
  body: string[];
}

const AUTHOR = 'Matthias Seghers <matthias@matthias.dev>';

const COMMITS: Commit[] = [
  {
    hash: '0000000',
    date: 'sometime in the 2000s',
    body: [
      'root commit',
      'tinkering, breaking things, not knowing the word for what I was doing',
      'no diff available',
    ],
  },
  {
    hash: 'a3f2c1d',
    date: '2010',
    body: ['initial commit — college, first real program', 'had no idea this would stick'],
  },
  {
    hash: '7b9e4f2',
    date: '2011',
    body: ['added loops. removed loops. added them back.'],
  },
  {
    hash: 'c4d9e1f',
    date: '2012',
    body: ['discovered Stack Overflow', 'productivity: +400%', 'original thought: -12%'],
  },
  {
    hash: '9f3a2b8',
    date: '2013',
    body: [
      'first project people actually used',
      'they found 11 bugs immediately',
      'fixed 9, the other 2 are "features"',
    ],
  },
  {
    hash: '3e7c1d4',
    date: '2014-2017',
    body: [
      'bulk commit: assignments, side projects, late nights',
      '+42000 lines  -39000 lines',
      'net: somewhere better than before',
    ],
  },
  {
    hash: '2d8c1a9',
    date: '2018',
    body: [
      'first professional commit',
      'message said: "fix typo"',
      'actually: rewrote entire module, too scared to say so',
    ],
  },
  {
    hash: 'f4e7b3c',
    date: '2019',
    body: ['first year where it started to click', 'imposter syndrome: present, loud, ignored'],
  },
  {
    hash: '8c2d5e1',
    date: '2020-2021',
    body: [
      'grew fast',
      'broke things professionally now',
      'learned that breaking things professionally',
      'is just called "shipping"',
    ],
  },
  {
    hash: 'b1e9f2a',
    date: '2022-2023',
    body: ['started trusting own instincts', 'deleted more code than wrote', 'best years yet'],
  },
  {
    hash: '4f8a1c9',
    date: '2024-2025',
    body: [
      'got comfortable being the person others ask',
      'still occasionally google basic syntax',
      'made peace with that',
    ],
  },
  {
    hash: '1a2b3c4',
    date: 'today',
    body: ['shipped this', "you're looking at it"],
  },
];

// ─── Renderer ─────────────────────────────────────────────────────────────────

export function cmdGitLog(): Line[] {
  const lines: Line[] = [];

  COMMITS.forEach((commit, i) => {
    lines.push({ text: `commit ${commit.hash}`, style: 'warn' });
    lines.push({ text: `Author: ${AUTHOR}`, style: 'dim' });
    lines.push({ text: `Date:   ${commit.date}`, style: 'dim' });
    lines.push({ text: '\u00A0' });
    commit.body.forEach((l) => lines.push({ text: `    ${l}` }));
    if (i < COMMITS.length - 1) lines.push({ text: '\u00A0' });
  });

  return lines;
}
