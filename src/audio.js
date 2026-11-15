// Web Audio API Procedural Sound Synthesizer
// Zero external assets required - 100% browser-native audio

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const sound = {
  toggle: () => {
    soundEnabled = !soundEnabled;
    return soundEnabled;
  },
  isEnabled: () => soundEnabled,

  // Button click / UI tap
  click: () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay restrictions safety
    }
  },

  // Part attach snap sound (solid mechanical clunk)
  snap: () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  },

  // Telemetry beep
  beep: (freq = 980) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  },

  // Rocket engine thrust rumble
  launchRoar: (duration = 4) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      // White noise buffer
      const bufferSize = ctx.sampleRate * Math.min(duration, 5);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Lowpass filter to simulate deep rocket rumble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(450, ctx.currentTime + 1.5);
      filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + duration);
    } catch {}
  },

  // Success fanfare / Discovery chime
  success: () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.65);
      });
    } catch {}
  },

  // Scientific scanning sweep sound
  scan: () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }
};
