import type { CommandModule, AboutData } from '../../types';
import { config } from '../../config';
import aboutData from '../../data/about.json';

const about = aboutData as AboutData;

export const command: CommandModule = {
  description: 'Who is using this terminal',
  fn: () => [
    {
      text: `${config.username} \u2014 ${about.title.toLowerCase()}, coffee dependent, occasionally ships things`,
    },
  ],
};
