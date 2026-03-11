import type { Line } from '../../types';

export function npmInstall(): Line[] {
  return [
    { text: 'npm warn deprecated several-things@1.x: Use the new thing instead', style: 'warn' },
    { text: 'npm http fetch GET 200 https://registry.npmjs.org/lodash',     delayMs: 320, style: 'dim' },
    { text: 'npm http fetch GET 200 https://registry.npmjs.org/chalk',      delayMs: 320, style: 'dim' },
    { text: 'npm http fetch GET 200 https://registry.npmjs.org/typescript', delayMs: 320, style: 'dim' },
    { text: 'npm http fetch GET 200 https://registry.npmjs.org/webpack',    delayMs: 320, style: 'dim' },
    { text: '\u00A0',                                                         delayMs: 700 },
    { text: 'added 847 packages in 3s' },
    { text: '\u00A0' },
    { text: '247 packages are looking for funding', style: 'dim' },
    { text: '  run `npm fund` for details', style: 'dim' },
  ];
}
