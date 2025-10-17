import type { AudioKey } from "@/shared/constants";

export interface RacePageAudioManagerConfig {
  playAudio: (sound: AudioKey) => void;
  stopAudio: (sound: AudioKey) => void;
  playAllRunSounds: () => void;
  stopAllRunSounds: () => void;
  initializeAudio: () => void;
  isMusicEnabled: () => boolean;
  isSoundEnabled: () => boolean;
  getRaceState?: () => any;
  getIsPaused?: () => boolean;
}

export interface AudioState {
  isInitialized: boolean;
  isAmbiencePlaying: boolean;
  isRunSoundsActive: boolean;
  runSoundInterval: number | null;
  audioUpdateTimeout: number | null;
}

export interface AudioSettings {
  isMusicEnabled: boolean;
  isSoundEnabled: boolean;
}

export class RacePageAudioManager {
  private config: RacePageAudioManagerConfig;
  private state: AudioState;

  constructor(config: RacePageAudioManagerConfig) {
    this.config = config;
    this.state = {
      isInitialized: false,
      isAmbiencePlaying: false,
      isRunSoundsActive: false,
      runSoundInterval: null,
      audioUpdateTimeout: null,
    };
  }

  initialize(): void {
    this.config.initializeAudio();
    this.state.isInitialized = true;
  }

  playCallToPost(): void {
    this.config.playAudio("callToPost");
  }

  playGate(): void {
    this.config.playAudio("gate");
  }

  playAmbience(): void {
    if (this.config.isMusicEnabled()) {
      this.config.playAudio("ambience");
      this.state.isAmbiencePlaying = true;
    }
  }

  stopAmbience(): void {
    this.config.stopAudio("ambience");
    this.state.isAmbiencePlaying = false;
  }

  startRunSoundInterval(): void {
    if (this.state.runSoundInterval) return;

    this.state.runSoundInterval = window.setInterval(() => {
      const isRaceActive = this.config.getRaceState?.()?.isRaceActive ?? false;
      const isPaused = this.config.getIsPaused?.() ?? false;

      if (this.config.isSoundEnabled() && isRaceActive && !isPaused) {
        this.config.playAllRunSounds();
        this.state.isRunSoundsActive = true;
      } else {
        this.config.stopAllRunSounds();
        this.state.isRunSoundsActive = false;
      }
    }, 3000);
  }

  stopRunSoundInterval(): void {
    if (this.state.runSoundInterval) {
      clearInterval(this.state.runSoundInterval);
      this.state.runSoundInterval = null;
      this.state.isRunSoundsActive = false;
    }
  }

  stopAllRunSounds(): void {
    this.config.stopAllRunSounds();
    this.state.isRunSoundsActive = false;
  }

  handlePauseStateChange(isPaused: boolean, isRaceActive: boolean): void {
    setTimeout(() => {
      if (isPaused) {
        this.stopAmbience();
        this.stopAllRunSounds();
      } else if (isRaceActive) {
        this.playAmbience();
      }
    }, 10);
  }

  updateAudioSettings(_isRaceActive: boolean): void {
    if (this.state.audioUpdateTimeout) {
      clearTimeout(this.state.audioUpdateTimeout);
    }

    this.state.audioUpdateTimeout = window.setTimeout(() => {
      if (this.config.isMusicEnabled()) {
        this.playAmbience();
      } else {
        this.stopAmbience();
      }

      if (!this.config.isSoundEnabled()) {
        this.stopAllRunSounds();
      }

      this.state.audioUpdateTimeout = null;
    }, 50);
  }

  onMusicSettingChange(isRaceActive: boolean): void {
    this.updateAudioSettings(isRaceActive);
  }

  onSoundSettingChange(isRaceActive: boolean): void {
    this.updateAudioSettings(isRaceActive);
  }

  startRaceAudio(): void {
    this.playAmbience();
    this.playCallToPost();
  }

  stopRaceAudio(): void {
    this.stopAmbience();
    this.stopAllRunSounds();
    this.stopRunSoundInterval();
  }

  handleTabFocus(isRaceActive: boolean, isPaused: boolean): void {
    if (isRaceActive && !isPaused) {
      this.stopAmbience();
      this.stopAllRunSounds();
    }
  }

  getAudioState(): AudioState {
    return { ...this.state };
  }

  isAudioInitialized(): boolean {
    return this.state.isInitialized;
  }

  isAmbiencePlaying(): boolean {
    return this.state.isAmbiencePlaying;
  }

  areRunSoundsActive(): boolean {
    return this.state.isRunSoundsActive;
  }

  getAudioStatistics(): {
    isInitialized: boolean;
    isAmbiencePlaying: boolean;
    isRunSoundsActive: boolean;
    hasRunSoundInterval: boolean;
    hasAudioUpdateTimeout: boolean;
  } {
    return {
      isInitialized: this.state.isInitialized,
      isAmbiencePlaying: this.state.isAmbiencePlaying,
      isRunSoundsActive: this.state.isRunSoundsActive,
      hasRunSoundInterval: this.state.runSoundInterval !== null,
      hasAudioUpdateTimeout: this.state.audioUpdateTimeout !== null,
    };
  }

  cleanup(): void {
    if (this.state.runSoundInterval) {
      clearInterval(this.state.runSoundInterval);
      this.state.runSoundInterval = null;
    }

    if (this.state.audioUpdateTimeout) {
      clearTimeout(this.state.audioUpdateTimeout);
      this.state.audioUpdateTimeout = null;
    }

    this.stopRaceAudio();

    this.state = {
      isInitialized: false,
      isAmbiencePlaying: false,
      isRunSoundsActive: false,
      runSoundInterval: null,
      audioUpdateTimeout: null,
    };
  }

  validateConfig(): boolean {
    try {
      return (
        typeof this.config.playAudio === "function" &&
        typeof this.config.stopAudio === "function" &&
        typeof this.config.playAllRunSounds === "function" &&
        typeof this.config.stopAllRunSounds === "function" &&
        typeof this.config.initializeAudio === "function" &&
        typeof this.config.isMusicEnabled === "function" &&
        typeof this.config.isSoundEnabled === "function"
      );
    } catch {
      return false;
    }
  }
}
