declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export type SoundMode = "rain" | "thunderstorm" | "wind" | "sun" | "night" | null;

class WeatherSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public isPlaying: boolean = false;
  public currentMode: SoundMode = null;
  private activeNodes: Array<AudioNode | { stop?: () => void; disconnect?: () => void }> = [];
  private thunderTimer: ReturnType<typeof setInterval> | null = null;
  public volume: number = 0.4;

  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.currentMode = null;
    this.activeNodes = [];
    this.thunderTimer = null;
    this.volume = 0.4;
  }

  public initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      } catch (e) {
        this.masterGain.gain.value = this.volume;
      }
    }
  }

  public stop(): void {
    if (this.thunderTimer) {
      clearInterval(this.thunderTimer);
      this.thunderTimer = null;
    }

    this.activeNodes.forEach((node) => {
      try {
        if ("stop" in node && typeof node.stop === "function") {
          node.stop();
        }
        if ("disconnect" in node && typeof node.disconnect === "function") {
          node.disconnect();
        }
      } catch (e) {
        // Ignore already stopped nodes
      }
    });

    this.activeNodes = [];
    this.isPlaying = false;
    this.currentMode = null;
  }

  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    // Generate brown/pink filtered noise
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise approximation
      lastOut = data[i];
      data[i] *= 3.5; // boost
    }
    return buffer;
  }

  public playRain(withThunder: boolean = false): void {
    this.initContext();
    this.stop();
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    // Rain continuous background hiss/patter
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = "lowpass";
    rainFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    noiseSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push(noiseSource, rainFilter, rainGain);
    this.isPlaying = true;
    this.currentMode = withThunder ? "thunderstorm" : "rain";

    if (withThunder) {
      // Trigger periodic distant rumble
      this.thunderTimer = setInterval(() => {
        if (this.isPlaying && Math.random() > 0.4) {
          this.triggerThunder();
        }
      }, 7000);
      this.triggerThunder();
    }
  }

  public triggerThunder(): void {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, now);

    oscGain.gain.setValueAtTime(0.01, now);
    oscGain.gain.linearRampToValueAtTime(0.6, now + 0.15);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.5);

    // Add crackle noise
    const crackle = this.ctx.createBufferSource();
    crackle.buffer = this.createNoiseBuffer();
    const cFilter = this.ctx.createBiquadFilter();
    cFilter.type = "bandpass";
    cFilter.frequency.setValueAtTime(380, now);
    cFilter.Q.setValueAtTime(3, now);

    const cGain = this.ctx.createGain();
    cGain.gain.setValueAtTime(0.0, now);
    cGain.gain.linearRampToValueAtTime(0.4, now + 0.1);
    cGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    crackle.connect(cFilter);
    cFilter.connect(cGain);
    cGain.connect(this.masterGain);

    crackle.start(now);
    crackle.stop(now + 1.3);
  }

  public playWind(): void {
    this.initContext();
    this.stop();
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const bandFilter = this.ctx.createBiquadFilter();
    bandFilter.type = "bandpass";
    bandFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    bandFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    // LFO to modulate wind gust intensity
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(bandFilter.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    noiseSource.connect(bandFilter);
    bandFilter.connect(windGain);
    windGain.connect(this.masterGain);

    noiseSource.start();
    lfo.start();

    this.activeNodes.push(noiseSource, bandFilter, lfo, lfoGain, windGain);
    this.isPlaying = true;
    this.currentMode = "wind";
  }

  public playBreezeOrNature(isDay: boolean = true): void {
    this.initContext();
    this.stop();
    if (!this.ctx || !this.masterGain) return;

    // Gentle filtered airy background
    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const airyFilter = this.ctx.createBiquadFilter();
    airyFilter.type = "lowpass";
    airyFilter.frequency.setValueAtTime(400, this.ctx.currentTime);

    const bgGain = this.ctx.createGain();
    bgGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    noiseSource.connect(airyFilter);
    airyFilter.connect(bgGain);
    bgGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push(noiseSource, airyFilter, bgGain);
    this.isPlaying = true;
    this.currentMode = isDay ? "sun" : "night";

    // Periodic organic nature sound (chirp or night chime)
    this.thunderTimer = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const chirpOsc = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();

      chirpOsc.type = "sine";
      if (isDay) {
        // Bird tweet
        chirpOsc.frequency.setValueAtTime(2200, now);
        chirpOsc.frequency.exponentialRampToValueAtTime(3400, now + 0.08);
        chirpOsc.frequency.exponentialRampToValueAtTime(2600, now + 0.16);

        chirpGain.gain.setValueAtTime(0.001, now);
        chirpGain.gain.linearRampToValueAtTime(0.06, now + 0.04);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        chirpOsc.connect(chirpGain);
        chirpGain.connect(this.masterGain);
        chirpOsc.start(now);
        chirpOsc.stop(now + 0.22);
      } else {
        // Night cricket pulse
        chirpOsc.frequency.setValueAtTime(4400, now);
        chirpGain.gain.setValueAtTime(0.001, now);
        chirpGain.gain.linearRampToValueAtTime(0.03, now + 0.03);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        chirpOsc.connect(chirpGain);
        chirpGain.connect(this.masterGain);
        chirpOsc.start(now);
        chirpOsc.stop(now + 0.12);
      }
    }, isDay ? 4500 : 2200);
  }

  public playWeatherMood(weatherCode: number, isDay: boolean = true, cape: number = 0): void {
    if (weatherCode >= 95 || cape > 1500) {
      this.playRain(true); // Thunderstorm
    } else if ((weatherCode >= 51 && weatherCode <= 82) || weatherCode >= 80) {
      this.playRain(false); // Rain
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      this.playWind(); // Snow / cold gusts
    } else {
      this.playBreezeOrNature(isDay); // Pleasant breeze & nature
    }
  }
}

export const weatherAudio = new WeatherSoundEngine();
