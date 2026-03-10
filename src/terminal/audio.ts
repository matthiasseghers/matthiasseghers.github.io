// ─── Synthesised audio via Web Audio API ─────────────────────────────────────
// No audio files. All sound is generated on the fly using oscillators and noise.
// Browser requires a user gesture before AudioContext can produce sound —
// the boot "press any key" prompt naturally satisfies this.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

// ─── POST beep (single short square-wave burst) ───────────────────────────────

export function postBeep(): void {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = 'square'; // PC speaker characteristic
    osc.frequency.value = 880; // classic BIOS POST frequency
    gain.gain.value = 0.25;

    osc.start();
    osc.stop(ac.currentTime + 0.18);
  } catch {
    // Audio unavailable — fail silently
  }
}

// ─── Mechanical key click ────────────────────────────────────────────────────
// Bassy two-stage sound:
//   Stage 1 — body thud:  wide bandpass at ~280 Hz, the main low-mid mass
//   Stage 2 — sub thump:  short sine burst at ~90 Hz for tactile low-end punch

function noiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const size = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, size, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function keyClick(): void {
  try {
    const ac = getCtx();
    const t = ac.currentTime;

    // Stage 1: click transient — sharp highpass burst for the crisp attack
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

    // Stage 2: key body — mid bandpass for the "thock" (700 Hz sweet spot)
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
