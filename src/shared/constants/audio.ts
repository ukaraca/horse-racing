// Audio Keys - Type-safe audio identifiers
export const AUDIO_KEYS = {
  // Music Group
  AMBIENCE: "ambience",

  // Sound Effects Group
  CALL_TO_POST: "callToPost",
  GATE: "gate",
  RUN1: "run1",
  RUN2: "run2",
  RUN3: "run3",
} as const;

// Type for audio keys
export type AudioKey = (typeof AUDIO_KEYS)[keyof typeof AUDIO_KEYS];

// Audio file paths
export const AUDIO_FILES = {
  [AUDIO_KEYS.AMBIENCE]: "https://plays.org/game/horse-racing/assets/sounds/sound_ambience.ogg",
  [AUDIO_KEYS.CALL_TO_POST]:
    "https://plays.org/game/horse-racing/assets/sounds/sound_calltopost.ogg",
  [AUDIO_KEYS.GATE]: "https://plays.org/game/horse-racing/assets/sounds/sound_gate.ogg",
  [AUDIO_KEYS.RUN1]: "https://plays.org/game/horse-racing/assets/sounds/sound_run.ogg",
  [AUDIO_KEYS.RUN2]: "https://plays.org/game/horse-racing/assets/sounds/sound_run2.ogg",
  [AUDIO_KEYS.RUN3]: "https://plays.org/game/horse-racing/assets/sounds/sound_run3.ogg",
} as const;

// Run sound keys array
export const RUN_SOUND_KEYS = [AUDIO_KEYS.RUN1, AUDIO_KEYS.RUN2, AUDIO_KEYS.RUN3] as const;

// Audio configurations
export const AUDIO_CONFIG = {
  [AUDIO_KEYS.AMBIENCE]: { loop: true, volume: 0.6 },
  [AUDIO_KEYS.CALL_TO_POST]: { volume: 0.8 },
  [AUDIO_KEYS.GATE]: { volume: 0.9 },
  [AUDIO_KEYS.RUN1]: { loop: true, volume: 0.7 },
  [AUDIO_KEYS.RUN2]: { loop: true, volume: 0.7 },
  [AUDIO_KEYS.RUN3]: { loop: true, volume: 0.7 },
} as const;
