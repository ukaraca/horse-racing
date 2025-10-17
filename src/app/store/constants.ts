/**
 * Vuex store constants for type-safe store operations
 */

// Module names
export const STORE_MODULES = {
  GAME: "game",
} as const;

// localStorage keys
export const LOCALSTORAGE_KEYS = {
  SETTINGS: "horse-racing-settings",
} as const;

// Game module getters
export const GAME_GETTERS = {
  HORSES: "game/horses",
  ROUNDS: "game/rounds",
  RESULTS: "game/results",
  IS_GENERATED: "game/isGenerated",
  IS_RACING: "game/isRacing",
  CURRENT_ROUND: "game/currentRound",
  SURFACE: "game/surface",
  TRACK: "game/track",
  SETTINGS: "game/settings",
  RACE_STATE: "game/raceState",
  CURRENT_RACE_HORSES: "game/currentRaceHorses",
  IS_MUSIC_ENABLED: "game/isMusicEnabled",
  IS_SOUND_ENABLED: "game/isSoundEnabled",
  IS_FULLSCREEN_ENABLED: "game/isFullscreenEnabled",
  LAST_FINISHED_ROUND_ID: "game/lastFinishedRoundId",
  GRAND_FINAL_RESULTS: "game/grandFinalResults",
  ROUND_POINTS: "game/roundPoints",
} as const;

// Game module actions
export const GAME_ACTIONS = {
  GENERATE_HORSES: "game/generateHorses",
  GENERATE_RACE_SCHEDULE: "game/generateRaceSchedule",
  START_RACE: "game/startRace",
  FINISH_RACE: "game/finishRace",
  PAUSE_RACE: "game/pauseRace",
  RESUME_RACE: "game/resumeRace",
  UPDATE_HORSE_POSITIONS: "game/updateHorsePositions",
  CALCULATE_GRAND_FINAL_RESULTS: "game/calculateGrandFinalResults",
  CLEAR_LAST_FINISHED_ROUND: "game/clearLastFinishedRound",
  TOGGLE_MUSIC: "game/toggleMusic",
  TOGGLE_SOUND: "game/toggleSound",
  TOGGLE_FULLSCREEN: "game/toggleFullscreen",
  UPDATE_SETTINGS: "game/updateSettings",
  RESET_GAME: "game/resetGame",
} as const;

// Types for type safety
export type StoreModule = (typeof STORE_MODULES)[keyof typeof STORE_MODULES];
export type GameGetter = (typeof GAME_GETTERS)[keyof typeof GAME_GETTERS];
export type GameAction = (typeof GAME_ACTIONS)[keyof typeof GAME_ACTIONS];
export type LocalStorageKey = (typeof LOCALSTORAGE_KEYS)[keyof typeof LOCALSTORAGE_KEYS];
