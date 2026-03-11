// ─── Synthesised audio via Web Audio API ─────────────────────────────────────
// No audio files — all sound generated on the fly.
// Inspired by Fallout terminal audio: soft per-character ticks and
// a descending two-tone blip when a line finishes printing.
//
// Browser requires a user gesture before AudioContext can produce sound —
// the boot "press any key" prompt naturally satisfies this.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function noiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const size = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, size, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function sine(
  ac: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gain: number,
): void {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// ─── Mechanical key click ─────────────────────────────────────────────────────
// Used when the user types. Two-stage:
//   Stage 1 — sharp highpass noise burst for the crisp attack
//   Stage 2 — mid bandpass noise for the "thock" body

export function keyClick(): void {
  try {
    const ac = getCtx();
    const t = ac.currentTime;

    const snap = ac.createBufferSource();
    snap.buffer = noiseBuffer(ac, 0.006);
    const snapHp = ac.createBiquadFilter();
    snapHp.type = 'highpass';
    snapHp.frequency.value = 2500;
    const snapGain = ac.createGain();
    snapGain.gain.setValueAtTime(0.5, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.005);
    snap.connect(snapHp);
    snapHp.connect(snapGain);
    snapGain.connect(ac.destination);
    snap.start(t);

    const thud = ac.createBufferSource();
    thud.buffer = noiseBuffer(ac, 0.04);
    const thudBp = ac.createBiquadFilter();
    thudBp.type = 'bandpass';
    thudBp.frequency.value = 700;
    thudBp.Q.value = 1.5;
    const thudGain = ac.createGain();
    thudGain.gain.setValueAtTime(0.4, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    thud.connect(thudBp);
    thudBp.connect(thudGain);
    thudGain.connect(ac.destination);
    thud.start(t);
  } catch {
    // Audio unavailable — fail silently
  }
}

// ─── Print tick ───────────────────────────────────────────────────────────────
// Called per character as output lines are printed.
// Very soft — present in the mix but never distracting.
// Pitch is randomised ±15% to avoid a robotic metronome feel.

export function printTick(): void {
  try {
    const ac = getCtx();
    const t = ac.currentTime;

    // Slight pitch randomisation — Fallout terminals feel slightly organic
    const baseFreq = 1100 + (Math.random() - 0.5) * 330;

    // Tiny noise click — the physical "print head" component
    const noise = ac.createBufferSource();
    noise.buffer = noiseBuffer(ac, 0.008);
    const hp = ac.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 3000;
    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(0.06, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.007);
    noise.connect(hp);
    hp.connect(noiseGain);
    noiseGain.connect(ac.destination);
    noise.start(t);

    // Short sine blip — the electronic "CRT phosphor" component
    sine(ac, baseFreq, t, 0.018, 0.04);
  } catch {
    // Audio unavailable — fail silently
  }
}

// ─── Line-end blip ────────────────────────────────────────────────────────────
// Called when a line finishes printing.
// Descending two-tone — the characteristic Fallout terminal "bloop".
// Subtle enough not to be annoying on long output.

export function printLineEnd(): void {
  try {
    const ac = getCtx();
    const t = ac.currentTime;

    // First tone — higher
    sine(ac, 660, t, 0.06, 0.06);
    // Second tone — lower, slightly delayed
    sine(ac, 440, t + 0.055, 0.08, 0.05);
  } catch {
    // Audio unavailable — fail silently
  }
}

// ─── POST beep ────────────────────────────────────────────────────────────────
// Single confirmation tone at the end of the boot sequence.

export function postBeep(): void {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    sine(ac, 880, t, 0.12, 0.15);
    sine(ac, 1100, t + 0.1, 0.1, 0.1);
  } catch {
    // Audio unavailable — fail silently
  }
}
