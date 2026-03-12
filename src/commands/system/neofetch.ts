import type { CommandModule, AboutData } from '../../types';
import { config } from '../../config';
import { ASCII_M } from '../../terminal/welcome';
import aboutData from '../../data/about.json';

const about = aboutData as AboutData;
const PAD = 18;

export const command: CommandModule = {
  description: 'System info, neofetch-style',
  fn: () => {
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
    const lines = [];

    for (let i = 0; i < count; i++) {
      const art = (artLines[i] ?? '').padEnd(PAD);
      const inf = infoLines[i] ?? '';
      lines.push({ text: `<span class="bright">${art}</span>${inf}`, html: true });
    }
    lines.push({ text: '\u00A0' });
    return lines;
  },
};
