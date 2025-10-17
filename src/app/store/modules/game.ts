import { actions } from "../actions/game";
import { LOCALSTORAGE_KEYS } from "../constants";
import { getters } from "../getters/game";
import { mutations } from "../mutations/game";
import type { IGameState } from "../types";

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_KEYS.SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        isMusicEnabled: parsed.isMusicEnabled ?? true,
        isSoundEnabled: parsed.isSoundEnabled ?? true,
        isFullscreenEnabled: false,
      };
    }
  } catch (error) {
    console.warn("Failed to load settings from localStorage:", error);
  }

  return {
    isMusicEnabled: true,
    isSoundEnabled: true,
    isFullscreenEnabled: false,
  };
};

const state: () => IGameState = () => ({
  horses: [],
  rounds: [],
  results: [],
  isGenerated: false,
  isRacing: false,
  currentRound: 0,
  surface: null,
  track: null,
  settings: loadSettings(),
  raceState: {
    isRaceActive: false,
    isPaused: false,
    currentRaceHorses: [],
    raceDistance: 0,
    finishLineX: 0,
    raceStartTime: 0,
  },
  lastFinishedRoundId: null,
  grandFinalResults: [],
  roundPoints: [],
});

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
