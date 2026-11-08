// Super Kick Kingdom 2.0 (Deluxe Edition) — Procedural WebAudio Sound & Biome Music Engine
// 100% original synthesized arcade SFX, 7 distinct stadium soundtracks, Hyper-Strike & Parry audio

export class AudioEngine {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.noiseBuffer = null;

    this.currentTrack = null;
    this.musicTimer = null;
    this.stepIndex = 0;
    this.urgentTempo = false;
  }

  unlock() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      // Gentle compressor keeps big chaotic moments punchy without clipping
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 6;
      comp.attack.value = 0.005;
      comp.release.value = 0.15;

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(comp);
      comp.connect(this.ctx.destination);

      this._buildNoiseBuffer();
      this.syncVolumes();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _buildNoiseBuffer() {
    const sr = this.ctx.sampleRate;
    const len = sr * 1.5;
    const buf = this.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buf;
  }

  syncVolumes() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const master = this.settings.muted ? 0 : this.settings.masterVolume;
    this.masterGain.gain.setTargetAtTime(master, now, 0.02);
    this.musicGain.gain.setTargetAtTime(this.settings.musicVolume * 0.42, now, 0.03);
    this.sfxGain.gain.setTargetAtTime(this.settings.sfxVolume, now, 0.02);
  }

  toggleMute() {
    this.settings.muted = !this.settings.muted;
    this.syncVolumes();
    return this.settings.muted;
  }

  _tone({
    freq = 440,
    endFreq = null,
    type = 'triangle',
    duration = 0.12,
    gain = 0.25,
    attack = 0.004,
    delay = 0,
    dest = null,
  }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), t0);
    if (endFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t0 + duration);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(g);
    g.connect(dest || this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  _noise({
    duration = 0.12,
    gain = 0.2,
    filterType = 'bandpass',
    freq = 1200,
    q = 1.2,
    delay = 0,
    dest = null,
  }) {
    if (!this.ctx || !this.noiseBuffer) return;
    const t0 = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, t0);
    filter.Q.value = q;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    src.connect(filter);
    filter.connect(g);
    g.connect(dest || this.sfxGain);
    src.start(t0);
    src.stop(t0 + duration + 0.02);
  }

  // --- UI & Locker Room Sounds ---
  playHover() {
    this._tone({ freq: 580, endFreq: 740, type: 'sine', duration: 0.055, gain: 0.1 });
  }

  playClick() {
    this._tone({ freq: 440, endFreq: 880, type: 'triangle', duration: 0.09, gain: 0.2 });
    this._tone({ freq: 660, endFreq: 1120, type: 'sine', duration: 0.07, gain: 0.12, delay: 0.02 });
  }

  playBack() {
    this._tone({ freq: 560, endFreq: 310, type: 'triangle', duration: 0.09, gain: 0.18 });
  }

  playCoin() {
    this._tone({ freq: 987.77, type: 'sine', duration: 0.08, gain: 0.22 });
    this._tone({ freq: 1318.51, type: 'triangle', duration: 0.22, gain: 0.24, delay: 0.07 });
  }

  playTrophyUnlock() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((f, i) => {
      this._tone({ freq: f, type: 'triangle', duration: 0.18, gain: 0.22, delay: i * 0.065 });
      this._tone({ freq: f * 1.5, type: 'sine', duration: 0.14, gain: 0.1, delay: i * 0.065 + 0.02 });
    });
  }

  // --- Character & Movement Sounds ---
  playJump(character, isDouble = false) {
    const base = (character?.voiceBase || 320) * (isDouble ? 1.24 : 1.0) * (0.95 + Math.random() * 0.1);
    const style = character?.voiceStyle || 'hero';
    if (style === 'monster') {
      this._tone({ freq: base, endFreq: base * 1.7, type: 'sawtooth', duration: 0.16, gain: 0.18 });
    } else if (style === 'dino') {
      this._tone({ freq: base * 0.85, endFreq: base * 1.9, type: 'sine', duration: 0.14, gain: 0.22 });
      this._tone({ freq: base * 1.5, endFreq: base * 2.2, type: 'triangle', duration: 0.08, gain: 0.14, delay: 0.06 });
    } else if (style === 'royal') {
      this._tone({ freq: base, endFreq: base * 1.55, type: 'sine', duration: 0.16, gain: 0.18 });
    } else if (style === 'grumpy') {
      this._tone({ freq: base, endFreq: base * 1.45, type: 'square', duration: 0.13, gain: 0.13 });
    } else {
      this._tone({ freq: base, endFreq: base * 1.85, type: 'triangle', duration: 0.14, gain: 0.22 });
    }
  }

  playDash() {
    this._noise({ duration: 0.12, gain: 0.18, filterType: 'bandpass', freq: 1800, q: 1.5 });
    this._tone({ freq: 340, endFreq: 680, type: 'sine', duration: 0.1, gain: 0.14 });
  }

  playGroundPoundStart() {
    this._tone({ freq: 460, endFreq: 920, type: 'triangle', duration: 0.11, gain: 0.22 });
    this._noise({ duration: 0.1, gain: 0.16, filterType: 'bandpass', freq: 2400, q: 2 });
  }

  playGroundPoundImpact() {
    this._tone({ freq: 155, endFreq: 38, type: 'sine', duration: 0.32, gain: 0.48 });
    this._noise({ duration: 0.24, gain: 0.36, filterType: 'lowpass', freq: 520, q: 0.9 });
  }

  playSwing(type = 'side') {
    const f = type === 'up' ? 2200 : type === 'spike' ? 1400 : 1750;
    this._noise({ duration: 0.09, gain: 0.18, filterType: 'bandpass', freq: f, q: 1.8 });
    this._tone({
      freq: type === 'up' ? 280 : 360,
      endFreq: type === 'up' ? 620 : 190,
      type: 'triangle',
      duration: 0.09,
      gain: 0.14,
    });
  }

  playBallKick(powerRatio = 0.5, isCharged = false) {
    const p = Math.min(1.5, Math.max(0.2, powerRatio));
    this._tone({
      freq: 165 + p * 75,
      endFreq: 48,
      type: 'sine',
      duration: 0.16 + p * 0.06,
      gain: 0.38,
    });
    this._noise({
      duration: 0.08 + p * 0.06,
      gain: 0.24 * p,
      filterType: 'bandpass',
      freq: 2100 + p * 900,
      q: 1.4,
    });
    if (isCharged || p > 0.92) {
      this._tone({ freq: 920, endFreq: 180, type: 'sawtooth', duration: 0.18, gain: 0.22 });
      this._noise({ duration: 0.16, gain: 0.3, filterType: 'highpass', freq: 2800, q: 0.9 });
    }
  }

  // --- Deluxe Combat Depth Audio (Parry, Combo Voltage, Hyper-Strike) ---
  playParry() {
    this._tone({ freq: 1046.5, endFreq: 2093, type: 'triangle', duration: 0.22, gain: 0.3 });
    this._tone({ freq: 1567.98, endFreq: 1567.98, type: 'sine', duration: 0.28, gain: 0.24, delay: 0.02 });
    this._noise({ duration: 0.15, gain: 0.24, filterType: 'highpass', freq: 3400, q: 1.2 });
  }

  playComboPass() {
    [587.33, 880, 1174.66].forEach((f, i) => {
      this._tone({ freq: f, type: 'triangle', duration: 0.11, gain: 0.2, delay: i * 0.03 });
    });
  }

  playHyperCutIn() {
    // Deep bass drop + anime super-flash chord!
    this._tone({ freq: 160, endFreq: 38, type: 'sawtooth', duration: 0.42, gain: 0.34 });
    this._noise({ duration: 0.32, gain: 0.26, filterType: 'bandpass', freq: 2200, q: 0.9 });
    [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
      this._tone({ freq: f, endFreq: f * 1.03, type: 'triangle', duration: 0.36, gain: 0.18, delay: i * 0.035 });
    });
  }

  // --- Stage Hazard & Mutator Audio ---
  playPortalWarp() {
    this._tone({ freq: 360, endFreq: 1080, type: 'sine', duration: 0.16, gain: 0.22 });
    this._tone({ freq: 920, endFreq: 480, type: 'triangle', duration: 0.14, gain: 0.16, delay: 0.08 });
  }

  playDrumBounce() {
    this._tone({ freq: 135, endFreq: 320, type: 'sine', duration: 0.12, gain: 0.32 });
    this._tone({ freq: 290, endFreq: 110, type: 'triangle', duration: 0.16, gain: 0.24, delay: 0.05 });
  }

  playIcicleCrash() {
    [1396, 1864, 2349].forEach((f, i) => {
      this._tone({ freq: f, endFreq: f * 0.7, type: 'sine', duration: 0.14, gain: 0.16, delay: i * 0.025 });
    });
    this._noise({ duration: 0.18, gain: 0.24, filterType: 'highpass', freq: 3200, q: 1.0 });
  }

  playBumperDing() {
    this._tone({ freq: 1318.5, type: 'sine', duration: 0.18, gain: 0.24 });
    this._tone({ freq: 1975.5, type: 'triangle', duration: 0.14, gain: 0.16, delay: 0.02 });
  }

  playBananaSlip() {
    this._tone({ freq: 780, endFreq: 220, type: 'sine', duration: 0.18, gain: 0.24 });
    this._tone({ freq: 340, endFreq: 920, type: 'triangle', duration: 0.14, gain: 0.2, delay: 0.09 });
  }

  playBallBounce(speed = 400, isPost = false) {
    const norm = Math.min(1, speed / 1400);
    if (norm < 0.06) return;
    if (isPost) {
      this._tone({ freq: 720, endFreq: 690, type: 'triangle', duration: 0.28, gain: 0.25 * norm });
      this._tone({ freq: 1140, endFreq: 1080, type: 'sine', duration: 0.22, gain: 0.18 * norm });
    } else {
      this._tone({
        freq: 135 + norm * 75,
        endFreq: 55,
        type: 'sine',
        duration: 0.09,
        gain: 0.24 * norm,
      });
    }
  }

  playBrawlHit() {
    this._tone({ freq: 210, endFreq: 65, type: 'square', duration: 0.14, gain: 0.22 });
    this._noise({ duration: 0.1, gain: 0.25, filterType: 'lowpass', freq: 1400, q: 1.0 });
  }

  playClash() {
    this._tone({ freq: 880, endFreq: 220, type: 'sawtooth', duration: 0.25, gain: 0.28 });
    this._tone({ freq: 1320, endFreq: 440, type: 'triangle', duration: 0.22, gain: 0.24 });
    this._noise({ duration: 0.22, gain: 0.32, filterType: 'bandpass', freq: 2600, q: 1.0 });
  }

  playWhistle(type = 'start') {
    if (type === 'start') {
      this._tone({ freq: 2550, endFreq: 2720, type: 'sine', duration: 0.24, gain: 0.22 });
      this._tone({ freq: 2620, endFreq: 2500, type: 'triangle', duration: 0.24, gain: 0.12 });
    } else if (type === 'end') {
      this._tone({ freq: 2600, endFreq: 2650, type: 'sine', duration: 0.16, gain: 0.22, delay: 0 });
      this._tone({ freq: 2600, endFreq: 2650, type: 'sine', duration: 0.16, gain: 0.22, delay: 0.2 });
      this._tone({ freq: 2650, endFreq: 2450, type: 'sine', duration: 0.48, gain: 0.26, delay: 0.4 });
    }
  }

  playCountdownTick(finalGo = false) {
    if (finalGo) {
      this._tone({ freq: 523.25, endFreq: 1046.5, type: 'triangle', duration: 0.28, gain: 0.28 });
      this._tone({ freq: 659.25, endFreq: 1318.5, type: 'sine', duration: 0.28, gain: 0.2 });
      this.playWhistle('start');
    } else {
      this._tone({ freq: 523.25, endFreq: 523.25, type: 'triangle', duration: 0.12, gain: 0.22 });
    }
  }

  playGoal() {
    this._noise({ duration: 0.2, gain: 0.22, filterType: 'highpass', freq: 2400 });
    const chord = [261.63, 329.63, 392.0, 523.25];
    chord.forEach((f, idx) => {
      this._tone({
        freq: f,
        endFreq: f * 1.01,
        type: 'sawtooth',
        duration: 0.65,
        gain: 0.12,
        attack: 0.02,
        delay: idx * 0.04,
      });
    });
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      this._tone({
        freq: f,
        type: 'triangle',
        duration: 0.22,
        gain: 0.22,
        delay: 0.15 + i * 0.09,
      });
    });
    this._noise({ duration: 1.1, gain: 0.26, filterType: 'bandpass', freq: 950, q: 0.6, delay: 0.05 });
  }

  playSuddenDeath() {
    const notes = [440, 415.3, 392, 349.23];
    notes.forEach((f, i) => {
      this._tone({ freq: f, endFreq: f * 0.98, type: 'sawtooth', duration: 0.26, gain: 0.2, delay: i * 0.18 });
    });
    this._noise({ duration: 0.7, gain: 0.2, filterType: 'bandpass', freq: 1200, q: 0.8 });
  }

  playItemPickup() {
    const arp = [587.33, 783.99, 987.77, 1174.66];
    arp.forEach((f, i) => {
      this._tone({ freq: f, type: 'sine', duration: 0.11, gain: 0.18, delay: i * 0.045 });
    });
  }

  playItemUse(itemId) {
    switch (itemId) {
      case 'RedMushroom':
      case 'EnlargeBall':
        [261, 330, 392, 523, 659, 784].forEach((f, i) =>
          this._tone({ freq: f, type: 'square', duration: 0.09, gain: 0.13, delay: i * 0.045 })
        );
        break;
      case 'TinyMushroom':
        [784, 988, 1175, 1568].forEach((f, i) =>
          this._tone({ freq: f, type: 'sine', duration: 0.08, gain: 0.16, delay: i * 0.04 })
        );
        break;
      case 'IceFlower':
        [1046, 1318, 1568, 2093].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', duration: 0.18, gain: 0.16, delay: i * 0.035 })
        );
        break;
      case 'FireFlower':
        this._noise({ duration: 0.35, gain: 0.28, filterType: 'bandpass', freq: 700, q: 0.8 });
        this._tone({ freq: 240, endFreq: 620, type: 'sawtooth', duration: 0.25, gain: 0.18 });
        break;
      case '1UP':
        [659, 784, 1319, 1047, 1175, 1568].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', duration: 0.12, gain: 0.22, delay: i * 0.065 })
        );
        break;
      case 'POW':
        this._tone({ freq: 140, endFreq: 32, type: 'sawtooth', duration: 0.45, gain: 0.35 });
        this._noise({ duration: 0.45, gain: 0.34, filterType: 'lowpass', freq: 650, q: 0.9 });
        break;
      case 'BulletBill':
        this._tone({ freq: 180, endFreq: 70, type: 'sawtooth', duration: 0.3, gain: 0.25 });
        this._noise({ duration: 0.28, gain: 0.25, filterType: 'lowpass', freq: 900 });
        break;
      case 'GreenShell':
        this._tone({ freq: 420, endFreq: 760, type: 'triangle', duration: 0.12, gain: 0.22 });
        break;
      case 'GoalKeeper':
        [392, 523, 659].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', duration: 0.13, gain: 0.2, delay: i * 0.06 })
        );
        break;
      // --- 8 New Deluxe Items ---
      case 'SuperStar':
        [523, 659, 784, 1046, 1318, 1568].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', duration: 0.12, gain: 0.2, delay: i * 0.038 })
        );
        break;
      case 'ChainHound':
        this._tone({ freq: 190, endFreq: 95, type: 'sawtooth', duration: 0.13, gain: 0.28, delay: 0 });
        this._tone({ freq: 210, endFreq: 85, type: 'sawtooth', duration: 0.15, gain: 0.3, delay: 0.15 });
        this._noise({ duration: 0.12, gain: 0.2, filterType: 'highpass', freq: 2600, delay: 0.05 });
        break;
      case 'BananaBunch':
        this._tone({ freq: 440, endFreq: 860, type: 'sine', duration: 0.14, gain: 0.2 });
        break;
      case 'MagnetGlove':
        this._tone({ freq: 220, endFreq: 480, type: 'sine', duration: 0.25, gain: 0.22 });
        this._tone({ freq: 330, endFreq: 660, type: 'triangle', duration: 0.25, gain: 0.15, delay: 0.04 });
        break;
      case 'ShadowClone':
        [440, 659, 880, 1318].forEach((f, i) =>
          this._tone({ freq: f, type: 'sine', duration: 0.14, gain: 0.18, delay: i * 0.04 })
        );
        break;
      case 'ThunderZapper':
        this._noise({ duration: 0.52, gain: 0.38, filterType: 'bandpass', freq: 900, q: 0.7 });
        this._tone({ freq: 1450, endFreq: 75, type: 'sawtooth', duration: 0.38, gain: 0.28 });
        break;
      case 'WarpPipe':
        [0, 0.1, 0.2].forEach((d) => {
          this._tone({ freq: 520, endFreq: 210, type: 'square', duration: 0.08, gain: 0.16, delay: d });
        });
        break;
      case 'TriBall':
        [440, 587.33, 783.99].forEach((f, i) =>
          this._tone({ freq: f, endFreq: f * 1.4, type: 'triangle', duration: 0.13, gain: 0.22, delay: i * 0.06 })
        );
        break;
      default:
        this.playClick();
    }
  }

  // --- Dynamic Biome Music Sequencer (Menu, Victory + 7 Distinct Stadium Tracks!) ---
  startMusic(track = 'menu') {
    this.unlock();
    if (this.currentTrack === track && this.musicTimer) return;
    this.stopMusic();
    this.currentTrack = track;
    this.stepIndex = 0;
    this.urgentTempo = false;

    const baseTempos = {
      menu: 162,
      victory: 148,
      meadow: 136,
      match: 136,
      sky: 132,
      castle: 126,
      manor: 142,
      jungle: 130,
      glacier: 140,
      cosmos: 128,
    };

    const tick = () => {
      if (this.currentTrack !== track) return;
      if (this.ctx && this.ctx.state === 'running' && !this.settings.muted) {
        this._playMusicStep(track, this.stepIndex);
      }
      this.stepIndex = (this.stepIndex + 1) % 32;
      let stepMs = baseTempos[track] || 136;
      if (track !== 'menu' && track !== 'victory' && this.urgentTempo) {
        stepMs = Math.round(stepMs * 0.78);
      }
      this.musicTimer = setTimeout(tick, stepMs);
    };
    tick();
  }

  setUrgent(urgent) {
    this.urgentTempo = Boolean(urgent);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    this.currentTrack = null;
  }

  _playMusicStep(track, step) {
    const dest = this.musicGain;
    const isMatchTrack = track !== 'menu' && track !== 'victory';
    const shift = isMatchTrack && this.urgentTempo ? 1.122 : 1.0;

    if (track === 'menu') {
      const bass = [
        130.81, 0, 196.0, 0, 146.83, 0, 220.0, 0,
        164.81, 0, 196.0, 0, 130.81, 146.83, 164.81, 196.0,
        174.61, 0, 220.0, 0, 164.81, 0, 196.0, 0,
        146.83, 0, 196.0, 0, 130.81, 0, 196.0, 0,
      ];
      const lead = [
        523.25, 0, 659.25, 587.33, 523.25, 0, 392.0, 0,
        440.0, 523.25, 587.33, 0, 659.25, 0, 587.33, 0,
        698.46, 0, 659.25, 587.33, 523.25, 659.25, 783.99, 0,
        587.33, 0, 659.25, 587.33, 523.25, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step], type: 'triangle', duration: 0.14, gain: 0.28, dest });
      if (lead[step]) this._tone({ freq: lead[step], type: 'sine', duration: 0.13, gain: 0.2, dest });
      if (step % 4 === 0) this._tone({ freq: 95, endFreq: 38, type: 'sine', duration: 0.09, gain: 0.26, dest });
      if (step % 4 === 2) this._noise({ duration: 0.05, gain: 0.08, filterType: 'highpass', freq: 5000, dest });
      return;
    }

    if (track === 'victory') {
      const lead = [
        523.25, 659.25, 783.99, 1046.5, 0, 783.99, 1046.5, 0,
        880.0, 698.46, 783.99, 587.33, 659.25, 0, 523.25, 0,
        587.33, 698.46, 880.0, 1174.66, 0, 987.77, 783.99, 0,
        1046.5, 0, 783.99, 659.25, 523.25, 0, 0, 0,
      ];
      if (lead[step]) this._tone({ freq: lead[step], type: 'triangle', duration: 0.14, gain: 0.22, dest });
      if (step % 4 === 0) this._tone({ freq: 130.81, type: 'triangle', duration: 0.18, gain: 0.24, dest });
      return;
    }

    // Biome-specific stadium grooves!
    if (track === 'manor') {
      // Spooky playful Haunted Harpsichord-Funk (A harmonic minor)
      const bass = [
        110, 0, 164.81, 0, 130.81, 0, 164.81, 0,
        146.83, 0, 174.61, 0, 164.81, 0, 123.47, 0,
        110, 0, 164.81, 0, 130.81, 0, 220, 0,
        174.61, 0, 164.81, 0, 110, 0, 0, 0,
      ];
      const lead = [
        440, 523.25, 659.25, 0, 622.25, 659.25, 0, 440,
        587.33, 0, 523.25, 493.88, 523.25, 0, 415.3, 0,
        440, 523.25, 659.25, 880, 830.61, 880, 659.25, 0,
        698.46, 659.25, 523.25, 493.88, 440, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.13, gain: 0.28, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, type: 'square', duration: 0.08, gain: 0.1, dest });
      if (step % 4 === 0) this._tone({ freq: 90, endFreq: 36, type: 'sine', duration: 0.08, gain: 0.22, dest });
      if (step % 4 === 2) this._noise({ duration: 0.04, gain: 0.09, filterType: 'highpass', freq: 4500, dest });
    } else if (track === 'jungle') {
      // Tribal Marimba & Syncopated Bongo Groove
      const bass = [
        98, 0, 98, 130.81, 146.83, 0, 130.81, 98,
        116.54, 0, 130.81, 0, 146.83, 130.81, 116.54, 98,
        98, 0, 98, 130.81, 146.83, 0, 174.61, 146.83,
        130.81, 0, 116.54, 0, 98, 0, 146.83, 0,
      ];
      const lead = [
        392, 0, 466.16, 523.25, 587.33, 0, 523.25, 392,
        466.16, 523.25, 587.33, 0, 698.46, 587.33, 523.25, 0,
        392, 466.16, 587.33, 0, 783.99, 698.46, 587.33, 523.25,
        466.16, 0, 523.25, 466.16, 392, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.12, gain: 0.3, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, endFreq: lead[step] * shift * 0.99, type: 'sine', duration: 0.11, gain: 0.24, dest });
      // Syncopated bongo percussion!
      if ([0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30].includes(step)) {
        const bf = step % 2 === 0 ? 180 : 265;
        this._tone({ freq: bf, endFreq: bf * 0.65, type: 'sine', duration: 0.07, gain: 0.2, dest });
      }
    } else if (track === 'glacier') {
      // Sparkling Aurora Crystal Chimes
      const bass = [
        130.81, 0, 196, 0, 164.81, 0, 196, 0,
        174.61, 0, 220, 0, 146.83, 0, 196, 0,
        130.81, 0, 196, 0, 164.81, 0, 246.94, 0,
        174.61, 0, 196, 0, 130.81, 0, 196, 0,
      ];
      const lead = [
        783.99, 1046.5, 987.77, 783.99, 659.25, 0, 783.99, 0,
        880, 1046.5, 1174.66, 0, 987.77, 783.99, 587.33, 0,
        783.99, 1046.5, 1318.5, 1174.66, 1046.5, 987.77, 783.99, 0,
        880, 783.99, 659.25, 587.33, 523.25, 0, 1046.5, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.15, gain: 0.26, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, type: 'sine', duration: 0.16, gain: 0.17, dest });
      if (step % 2 === 1) this._noise({ duration: 0.035, gain: 0.07, filterType: 'highpass', freq: 6500, dest });
    } else if (track === 'cosmos') {
      // Cosmic Starlight Synthwave Arp
      const roots = [110, 110, 87.31, 87.31, 130.81, 130.81, 98, 98];
      const rFreq = roots[Math.floor(step / 4)] * (step % 2 === 1 ? 2 : 1);
      this._tone({ freq: rFreq * shift, type: 'sawtooth', duration: 0.09, gain: 0.11, dest });
      const arp = [440, 523.25, 659.25, 880, 659.25, 523.25, 783.99, 659.25];
      const af = arp[step % 8] * (step >= 16 ? 1.122 : 1.0);
      this._tone({ freq: af * shift, type: 'triangle', duration: 0.11, gain: 0.16, dest });
      if (step % 4 === 0) this._tone({ freq: 115, endFreq: 38, type: 'sine', duration: 0.09, gain: 0.28, dest });
      if (step % 4 === 2) this._noise({ duration: 0.07, gain: 0.13, filterType: 'bandpass', freq: 2600, dest });
    } else if (track === 'castle') {
      // Magma Keep Boss Rock-Brass
      const bass = [
        82.41, 82.41, 0, 98, 110, 0, 98, 82.41,
        82.41, 82.41, 0, 123.47, 110, 98, 87.31, 82.41,
        98, 98, 0, 110, 123.47, 0, 110, 98,
        87.31, 0, 98, 0, 123.47, 110, 98, 82.41,
      ];
      const lead = [
        329.63, 0, 392, 440, 493.88, 0, 440, 392,
        329.63, 0, 493.88, 440, 392, 349.23, 329.63, 0,
        392, 0, 440, 493.88, 587.33, 0, 493.88, 440,
        349.23, 392, 440, 349.23, 493.88, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'sawtooth', duration: 0.11, gain: 0.15, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, type: 'triangle', duration: 0.12, gain: 0.22, dest });
      if (step % 2 === 0) this._tone({ freq: 115, endFreq: 36, type: 'sine', duration: 0.09, gain: 0.28, dest });
      if (step % 4 === 2) this._noise({ duration: 0.08, gain: 0.15, filterType: 'bandpass', freq: 2000, dest });
    } else if (track === 'sky') {
      // Cloud-Pipe Skyway Breezy Major-7th Synth
      const bass = [
        146.83, 0, 220, 0, 185.0, 0, 220, 0,
        196.0, 0, 246.94, 0, 164.81, 0, 220, 0,
        146.83, 0, 220, 0, 185.0, 0, 277.18, 0,
        196.0, 0, 220, 0, 146.83, 0, 220, 0,
      ];
      const lead = [
        587.33, 739.99, 880, 0, 739.99, 659.25, 587.33, 0,
        587.33, 659.25, 783.99, 880, 659.25, 0, 0, 0,
        587.33, 739.99, 880, 1174.66, 1108.73, 987.77, 880, 739.99,
        783.99, 659.25, 587.33, 739.99, 587.33, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.13, gain: 0.26, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, type: 'sine', duration: 0.13, gain: 0.2, dest });
      if (step % 4 === 0) this._tone({ freq: 105, endFreq: 42, type: 'sine', duration: 0.08, gain: 0.22, dest });
      if (step % 4 === 2) this._noise({ duration: 0.05, gain: 0.09, filterType: 'highpass', freq: 4800, dest });
    } else {
      // Classic Mushroom Meadow / Match Funk-Samba
      const bass = [
        110, 0, 110, 130.81, 146.83, 0, 130.81, 0,
        110, 0, 110, 146.83, 164.81, 0, 146.83, 130.81,
        130.81, 0, 130.81, 164.81, 196.0, 0, 164.81, 0,
        146.83, 0, 164.81, 0, 196.0, 164.81, 146.83, 130.81,
      ];
      const lead = [
        440, 0, 523.25, 0, 587.33, 659.25, 587.33, 523.25,
        440, 0, 392.0, 440, 523.25, 0, 0, 0,
        523.25, 0, 659.25, 0, 783.99, 880.0, 783.99, 659.25,
        587.33, 659.25, 587.33, 523.25, 440, 0, 587.33, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.12, gain: 0.3, dest });
      if (lead[step]) {
        this._tone({ freq: lead[step] * shift, type: 'square', duration: 0.11, gain: 0.09, dest });
        this._tone({ freq: lead[step] * shift, type: 'triangle', duration: 0.12, gain: 0.15, dest });
      }
      if (step % 2 === 0) this._tone({ freq: 110, endFreq: 40, type: 'sine', duration: 0.08, gain: 0.25, dest });
      if (step % 4 === 2) this._noise({ duration: 0.06, gain: 0.12, filterType: 'bandpass', freq: 2400, dest });
    }
  }
}
