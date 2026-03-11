import type { Line } from '../../types';
import { config } from '../../config';

export const description = 'Environment variables';

export function env(): Line[] {
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
