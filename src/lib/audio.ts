/**
 * THE ROOM
 * ----------------------------------------------------------------------------
 * Every sound on this site is generated in the browser. There are no audio
 * files, no sample library, no dependency — the same argument as the rest of
 * the build, applied to the one medium where nobody bothers.
 *
 * What is in here:
 *
 *   Room tone   — two detuned sine partials under a very slow filtered noise
 *                 bed. Not music. The sound of a large quiet space with
 *                 machinery somewhere in it.
 *   Lock        — a short filtered noise burst with a pitched click, played
 *                 when the mark finds its axes.
 *   Cut         — a low sweep for the moment the stone gives way.
 *   Drop        — a sub-bass fall for the kill switch, because that moment
 *                 should be felt rather than heard.
 *
 * It is silent until the reader asks for it. Autoplaying audio is the fastest
 * way to make an expensive thing feel cheap, and most browsers would refuse to
 * start the context anyway.
 */

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  bed: GainNode;
  stop: () => void;
};

let engine: Engine | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

const STORAGE_UNAVAILABLE = "corehold-sound";

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Brown-ish noise: integrated white, which sits far lower than white and
  // reads as air rather than hiss.
  let value = 0;
  for (let i = 0; i < length; i += 1) {
    value = (value + (Math.random() * 2 - 1) * 0.02) * 0.996;
    data[i] = value * 8;
  }
  return buffer;
}

function build(): Engine | null {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  /* ------------------------------------------------------------- room tone */
  const bed = ctx.createGain();
  bed.gain.value = 0.5;
  bed.connect(master);

  const air = ctx.createBufferSource();
  air.buffer = noiseBuffer(ctx, 6);
  air.loop = true;
  const airFilter = ctx.createBiquadFilter();
  airFilter.type = "lowpass";
  airFilter.frequency.value = 320;
  airFilter.Q.value = 0.5;
  const airGain = ctx.createGain();
  airGain.gain.value = 0.16;
  air.connect(airFilter).connect(airGain).connect(bed);
  air.start();

  // Two partials a hair apart. The beat frequency between them is the drift you
  // hear in a big room rather than a synthesiser.
  const partials: OscillatorNode[] = [];
  for (const [freq, level] of [
    [55, 0.05],
    [55.37, 0.04],
    [110.5, 0.018],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = level;
    osc.connect(gain).connect(bed);
    osc.start();
    partials.push(osc);
  }

  // A slow breath on the bed so it never sits perfectly still.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.045;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.18;
  lfo.connect(lfoGain).connect(bed.gain);
  lfo.start();

  return {
    ctx,
    master,
    bed,
    stop() {
      partials.forEach((o) => o.stop());
      lfo.stop();
      air.stop();
      ctx.close().catch(() => {});
    },
  };
}

export function soundEnabled() {
  return enabled;
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export async function toggleSound(): Promise<boolean> {
  if (enabled) {
    if (engine) {
      const { ctx, master } = engine;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      const dying = engine;
      engine = null;
      window.setTimeout(() => dying.stop(), 1200);
    }
    enabled = false;
    listeners.forEach((fn) => fn(false));
    return false;
  }

  engine = build();
  if (!engine) return false;
  try {
    await engine.ctx.resume();
  } catch {
    /* the gesture that called this should already have unlocked it */
  }
  engine.master.gain.setTargetAtTime(0.16, engine.ctx.currentTime, 0.9);
  enabled = true;
  listeners.forEach((fn) => fn(true));
  try {
    window.sessionStorage?.setItem(STORAGE_UNAVAILABLE, "1");
  } catch {
    /* storage is not required for this to work */
  }
  return true;
}

/* ------------------------------------------------------------------ events */

function envelope(
  gain: GainNode,
  ctx: AudioContext,
  peak: number,
  attack: number,
  release: number,
) {
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
}

/** The mark finding its axes. A machined click, not a UI beep. */
export function playLock() {
  if (!engine) return;
  const { ctx, master } = engine;

  const burst = ctx.createBufferSource();
  burst.buffer = noiseBuffer(ctx, 0.2);
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 2400;
  bandpass.Q.value = 1.4;
  const gain = ctx.createGain();
  burst.connect(bandpass).connect(gain).connect(master);
  envelope(gain, ctx, 0.5, 0.002, 0.09);
  burst.start();
  burst.stop(ctx.currentTime + 0.2);

  const body = ctx.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(320, ctx.currentTime);
  body.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);
  const bodyGain = ctx.createGain();
  body.connect(bodyGain).connect(master);
  envelope(bodyGain, ctx, 0.24, 0.003, 0.1);
  body.start();
  body.stop(ctx.currentTime + 0.2);
}

/** Stone giving way. */
export function playCut() {
  if (!engine) return;
  const { ctx, master } = engine;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, 1.2);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(1400, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.9);
  const gain = ctx.createGain();
  source.connect(filter).connect(gain).connect(master);
  envelope(gain, ctx, 0.3, 0.06, 0.85);
  source.start();
  source.stop(ctx.currentTime + 1.2);
}

/** The kill switch. Felt more than heard. */
export function playDrop() {
  if (!engine) return;
  const { ctx, master } = engine;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(26, ctx.currentTime + 0.75);
  const gain = ctx.createGain();
  osc.connect(gain).connect(master);
  envelope(gain, ctx, 0.72, 0.01, 0.8);
  osc.start();
  osc.stop(ctx.currentTime + 1.0);
}
