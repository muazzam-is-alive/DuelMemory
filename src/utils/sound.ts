// Web Audio API Synthesizer for Memory Duel

class SoundController {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private musicOscillatorTimer: number | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play button click / card tap sound
  playTap(sfxEnabled = true, volume = 0.5) {
    if (!sfxEnabled || volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context play error handled gracefully
    }
  }

  // Play Card Flip Sound (smooth swoosh / pitch rise)
  playFlip(sfxEnabled = true, volume = 0.5) {
    if (!sfxEnabled || volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore
    }
  }

  // Play Match Success Chime (Bright ascending dual tone with combo pitch elevation)
  playMatch(combo = 1, sfxEnabled = true, volume = 0.5) {
    if (!sfxEnabled || volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const baseFreq = 523.25 * Math.min(2, 1 + (combo - 1) * 0.15); // C5 base
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2]; // Arpeggio C, E, G, High C

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  // Play Mismatch Buzz/Shake (Low descending dual tone)
  playMismatch(sfxEnabled = true, volume = 0.5) {
    if (!sfxEnabled || volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore
    }
  }

  // Play Game Victory Fanfare
  playVictory(sfxEnabled = true, volume = 0.5) {
    if (!sfxEnabled || volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const melody = [
        { note: 523.25, duration: 0.12, delay: 0 },    // C5
        { note: 659.25, duration: 0.12, delay: 0.12 }, // E5
        { note: 783.99, duration: 0.12, delay: 0.24 }, // G5
        { note: 1046.50, duration: 0.35, delay: 0.36 } // C6
      ];

      melody.forEach(({ note, duration, delay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, ctx.currentTime + delay);

        gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      });
    } catch {
      // Ignore
    }
  }

  // Play Ambient Synth Loop for Background Music
  startBackgroundMusic(musicEnabled = true, volume = 0.3) {
    if (!musicEnabled || volume <= 0) {
      this.stopBackgroundMusic();
      return;
    }

    if (this.isMusicPlaying) {
      if (this.musicGainNode) {
        this.musicGainNode.gain.setValueAtTime(volume * 0.12, this.getAudioContext()?.currentTime || 0);
      }
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.musicGainNode = ctx.createGain();
    this.musicGainNode.gain.setValueAtTime(volume * 0.12, ctx.currentTime);
    this.musicGainNode.connect(ctx.destination);

    // Arpeggio chord progression in Am / F / C / G
    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [130.81, 164.81, 196.00], // C
      [196.00, 246.94, 293.66], // G
    ];

    let step = 0;
    const playNextNote = () => {
      if (!this.isMusicPlaying || !this.musicGainNode || !this.ctx) return;

      const chordIndex = Math.floor(step / 4) % chords.length;
      const noteIndex = step % 3;
      const freq = chords[chordIndex][noteIndex];

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(noteGain);
      noteGain.connect(this.musicGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);

      step++;
      this.musicOscillatorTimer = window.setTimeout(playNextNote, 400);
    };

    playNextNote();
  }

  stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicOscillatorTimer) {
      clearTimeout(this.musicOscillatorTimer);
      this.musicOscillatorTimer = null;
    }
  }
}

export const soundManager = new SoundController();
