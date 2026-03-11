// ─── Config ───────────────────────────────────────────────────────────────────
// Single import point for the app config.
// All other files import from here — never directly from config.json.

import type { Config } from './types';
import cfg from './config.json';

export const config: Config = cfg as Config;
