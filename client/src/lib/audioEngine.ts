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
  'Elena': 'mid',
  'Carlos': 'low',
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
