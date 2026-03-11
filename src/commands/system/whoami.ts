import type { Line, AboutData } from '../../types';
import { config } from '../../config';
import aboutData from '../../data/about.json';

const about = aboutData as AboutData;

export function whoami(): Line[] {
  return [
    {
      text: `${config.username} \u2014 ${about.title.toLowerCase()}, coffee dependent, occasionally ships things`,
    },
  ];
}
