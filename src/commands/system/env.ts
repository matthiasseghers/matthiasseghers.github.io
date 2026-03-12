import type { CommandModule } from '../../types';
import { config } from '../../config';

export const command: CommandModule = {
  description: 'Environment variables',
  fn: () => [
    { text: `USER=${config.username}` },
    { text: `HOME=/home/${config.username}` },
    { text: `SHELL=/bin/coffee` },
    { text: `EDITOR=vscode` },
    { text: `LANG=TypeScript` },
    { text: `NODE_ENV=production` },
    { text: `COFFEE_LEVEL=critical` },
    { text: `HOSTNAME=${config.hostname}` },
    { text: `TERM=xterm-256color` },
  ],
};
