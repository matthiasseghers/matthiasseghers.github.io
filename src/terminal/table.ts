import type { Line } from '../types';

// ─── Public API ───────────────────────────────────────────────────────────────

export type TableStyle = 'mysql' | 'separated' | 'dots';
export type ColAlign = 'left' | 'right' | 'center';

export interface TableConfig {
  headers: string[];
  rows: string[][];
  style?: TableStyle;
  align?: ColAlign[];
}

export function renderTable(cfg: TableConfig): Line[] {
  const style = cfg.style ?? 'mysql';
  const aligns = cfg.align ?? cfg.headers.map(() => 'left' as ColAlign);

  // ── Column widths ──────────────────────────────────────────────────────────
  const widths = cfg.headers.map((h, ci) =>
    Math.max(h.length, ...cfg.rows.map((r) => (r[ci] ?? '').length)),
  );

  // ── Style characters ──────────────────────────────────────────────────────
  const S = STYLES[style];

  // ── Build lines ───────────────────────────────────────────────────────────
  const lines: Line[] = [];

  lines.push(txt(S.top(widths)));
  lines.push(txt(row(cfg.headers, widths, aligns, S)));
  lines.push(txt(S.headSep(widths)));

  cfg.rows.forEach((r, ri) => {
    lines.push(txt(row(r, widths, aligns, S)));
    if (S.rowSep && ri < cfg.rows.length - 1) lines.push(txt(S.rowSep(widths)));
  });

  if (S.bottom) lines.push(txt(S.bottom(widths)));

  return lines;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function txt(text: string): Line {
  return { text };
}

function pad(text: string, width: number, align: ColAlign): string {
  const extra = width - text.length;
  if (extra <= 0) return text;
  if (align === 'right') return ' '.repeat(extra) + text;
  if (align === 'center') {
    const l = Math.floor(extra / 2),
      r = extra - l;
    return ' '.repeat(l) + text + ' '.repeat(r);
  }
  return text + ' '.repeat(extra); // left
}

function row(cells: string[], widths: number[], aligns: ColAlign[], s: StyleDef): string {
  const padded = widths.map((w, i) => ` ${pad(cells[i] ?? '', w, aligns[i] ?? 'left')} `);
  return s.vbar + padded.join(s.vbar) + s.vbar;
}

function hline(widths: number[], fill: string, left: string, mid: string, right: string): string {
  return left + widths.map((w) => fill.repeat(w + 2)).join(mid) + right;
}

// ─── Style definitions ────────────────────────────────────────────────────────

interface StyleDef {
  vbar: string;
  top: (w: number[]) => string;
  headSep: (w: number[]) => string;
  rowSep?: (w: number[]) => string;
  bottom?: (w: number[]) => string;
}

const STYLES: Record<TableStyle, StyleDef> = {
  // Classic MySQL: top+bottom dashes, header sep dashes, no row dividers
  mysql: {
    vbar: '|',
    top: (w) => hline(w, '-', '+', '+', '+'),
    headSep: (w) => hline(w, '-', '+', '+', '+'),
    bottom: (w) => hline(w, '-', '+', '+', '+'),
  },

  // Separated: header uses ===, every row has a --- divider
  separated: {
    vbar: '|',
    top: (w) => hline(w, '=', '+', '+', '+'),
    headSep: (w) => hline(w, '=', '+', '+', '+'),
    rowSep: (w) => hline(w, '-', '+', '+', '+'),
    bottom: (w) => hline(w, '-', '+', '+', '+'),
  },

  // Dots: . for borders, : as vbar
  dots: {
    vbar: ':',
    top: (w) => hline(w, '.', '.', '.', '.'),
    headSep: (w) => hline(w, '.', ':', ':', ':'),
    bottom: (w) => hline(w, '.', ':', ':', ':'),
  },
};
