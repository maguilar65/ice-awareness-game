let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const VOICE_PROFILES: Record<string, { baseFreq: number; freqRange: number; waveform: OscillatorType; duration: number }> = {
  low: { baseFreq: 120, freqRange: 60, waveform: 'square', duration: 0.04 },
  mid: { baseFreq: 200, freqRange: 80, waveform: 'square', duration: 0.035 },
  high: { baseFreq: 300, freqRange: 100, waveform: 'square', duration: 0.03 },
  child: { baseFreq: 380, freqRange: 120, waveform: 'triangle', duration: 0.03 },
  elder: { baseFreq: 150, freqRange: 50, waveform: 'sawtooth', duration: 0.05 },
  soft: { baseFreq: 250, freqRange: 60, waveform: 'triangle', duration: 0.035 },
};

const SPEAKER_VOICE_MAP: Record<string, string> = {
  'Robert': 'mid',
  'Alejandro Cruz': 'low',
  'Mrs. Chen': 'elder',
  'Rosa': 'soft',
  'James': 'low',
  'Pastor Davis': 'elder',
  'Atty. Kim': 'mid',
  'Davino': 'low',
  'Ms. Martinez': 'soft',
  'Tommy': 'child',
  'Sofia': 'child',
  'Abuela': 'elder',
  'Mama': 'soft',
  'Benjamin': 'child',
  'Officer Reyes': 'low',
  'Lucia': 'high',
  'Mr. Park': 'elder',
  'You': 'mid',
};

let lastPlayTime = 0;

export function playTalkBleep(speaker: string, charIndex: number) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (now - lastPlayTime < 0.025) return;
    lastPlayTime = now;

    const voiceKey = SPEAKER_VOICE_MAP[speaker] || 'mid';
    const voice = VOICE_PROFILES[voiceKey];

    const freq = voice.baseFreq + Math.sin(charIndex * 0.7) * voice.freqRange;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = voice.waveform;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 0.85, now + voice.duration);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0, now + voice.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + voice.duration);
  } catch {}
}

export function playChoiceSelect() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(660, now + 0.06);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
}

export function playDialogOpen() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [0, 0.05, 0.1].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(220 + i * 110, now + offset);

      gain.gain.setValueAtTime(0.05, now + offset);
      gain.gain.linearRampToValueAtTime(0, now + offset + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.06);
    });
  } catch {}
}

let lastStepTime = 0;

export function playFootstep(stepIndex: number) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (now - lastStepTime < 0.18) return;
    lastStepTime = now;

    const freq = stepIndex % 2 === 0 ? 90 : 110;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noise = ctx.createOscillator();
    const noiseGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 0.5, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.05);

    noise.type = 'sawtooth';
    noise.frequency.setValueAtTime(200 + Math.random() * 100, now);
    noiseGain.gain.setValueAtTime(0.015, now);
    noiseGain.gain.linearRampToValueAtTime(0, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
    noise.start(now);
    noise.stop(now + 0.03);
  } catch {}
}

export function playDoorTransition() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(150, now);
    osc1.frequency.linearRampToValueAtTime(80, now + 0.12);
    gain1.gain.setValueAtTime(0.05, now);
    gain1.gain.linearRampToValueAtTime(0, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(300, now + 0.1);
    osc2.frequency.linearRampToValueAtTime(500, now + 0.2);
    gain2.gain.setValueAtTime(0, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.04, now + 0.15);
    gain2.gain.linearRampToValueAtTime(0, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.25);
  } catch {}
}

let arcadeMusicNodes: { oscs: OscillatorNode[]; gains: GainNode[]; interval: ReturnType<typeof setInterval> | null } | null = null;

export function startArcadeMusic() {
  if (arcadeMusicNodes) return;
  try {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.07, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'square';
    bassOsc.frequency.setValueAtTime(110, ctx.currentTime);
    bassGain.gain.setValueAtTime(0, ctx.currentTime);
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start();
    oscs.push(bassOsc);
    gains.push(bassGain);

    const melodyOsc = ctx.createOscillator();
    const melodyGain = ctx.createGain();
    melodyOsc.type = 'square';
    melodyOsc.frequency.setValueAtTime(220, ctx.currentTime);
    melodyGain.gain.setValueAtTime(0, ctx.currentTime);
    melodyOsc.connect(melodyGain);
    melodyGain.connect(masterGain);
    melodyOsc.start();
    oscs.push(melodyOsc);
    gains.push(melodyGain);

    const hihatOsc = ctx.createOscillator();
    const hihatGain = ctx.createGain();
    hihatOsc.type = 'sawtooth';
    hihatOsc.frequency.setValueAtTime(800, ctx.currentTime);
    hihatGain.gain.setValueAtTime(0, ctx.currentTime);
    hihatOsc.connect(hihatGain);
    hihatGain.connect(masterGain);
    hihatOsc.start();
    oscs.push(hihatOsc);
    gains.push(hihatGain);

    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kickOsc.type = 'triangle';
    kickOsc.frequency.setValueAtTime(60, ctx.currentTime);
    kickGain.gain.setValueAtTime(0, ctx.currentTime);
    kickOsc.connect(kickGain);
    kickGain.connect(masterGain);
    kickOsc.start();
    oscs.push(kickOsc);
    gains.push(kickGain);

    const bassNotes = [110, 110, 146.83, 130.81, 110, 110, 146.83, 164.81,
                       110, 110, 146.83, 130.81, 164.81, 146.83, 130.81, 110];
    const melodyNotes = [440, 0, 523.25, 0, 392, 0, 440, 523.25,
                         0, 587.33, 0, 523.25, 440, 0, 392, 440,
                         349.23, 0, 440, 0, 523.25, 0, 587.33, 0,
                         523.25, 440, 0, 392, 349.23, 0, 392, 440];
    const dembow = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0];
    const hihat =  [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1];

    let step = 0;
    const bpm = 190;
    const stepTime = (60 / bpm) / 2 * 1000;

    const interval = setInterval(() => {
      try {
        const now = ctx.currentTime;

        const bassIdx = step % bassNotes.length;
        bassOsc.frequency.setValueAtTime(bassNotes[bassIdx], now);
        bassGain.gain.cancelScheduledValues(now);
        bassGain.gain.setValueAtTime(0.9, now);
        bassGain.gain.linearRampToValueAtTime(0.4, now + 0.1);

        const melIdx = step % melodyNotes.length;
        if (melodyNotes[melIdx] > 0) {
          melodyOsc.frequency.setValueAtTime(melodyNotes[melIdx], now);
          melodyGain.gain.cancelScheduledValues(now);
          melodyGain.gain.setValueAtTime(0.5, now);
          melodyGain.gain.linearRampToValueAtTime(0, now + 0.12);
        } else {
          melodyGain.gain.cancelScheduledValues(now);
          melodyGain.gain.setValueAtTime(0, now);
        }

        const dembowIdx = step % dembow.length;
        if (dembow[dembowIdx]) {
          kickOsc.frequency.setValueAtTime(80, now);
          kickOsc.frequency.linearRampToValueAtTime(40, now + 0.08);
          kickGain.gain.cancelScheduledValues(now);
          kickGain.gain.setValueAtTime(1.0, now);
          kickGain.gain.linearRampToValueAtTime(0, now + 0.1);
        }

        const hihatIdx = step % hihat.length;
        if (hihat[hihatIdx]) {
          hihatOsc.frequency.setValueAtTime(600 + Math.random() * 400, now);
          hihatGain.gain.cancelScheduledValues(now);
          hihatGain.gain.setValueAtTime(0.25, now);
          hihatGain.gain.linearRampToValueAtTime(0, now + 0.04);
        }

        step++;
      } catch {}
    }, stepTime);

    arcadeMusicNodes = { oscs, gains, interval };
  } catch {}
}

export function stopArcadeMusic() {
  if (!arcadeMusicNodes) return;
  try {
    if (arcadeMusicNodes.interval) clearInterval(arcadeMusicNodes.interval);
    arcadeMusicNodes.oscs.forEach(o => { try { o.stop(); } catch {} });
    arcadeMusicNodes = null;
  } catch {
    arcadeMusicNodes = null;
  }
}

export function playDialogClose() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [0, 0.05, 0.1].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440 - i * 110, now + offset);

      gain.gain.setValueAtTime(0.05, now + offset);
      gain.gain.linearRampToValueAtTime(0, now + offset + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.06);
    });
  } catch {}
}
