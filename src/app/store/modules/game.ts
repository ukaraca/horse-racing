import type { IGameState } from "../types";
import { mutations } from "../mutations/game";
import { actions } from "../actions/game";
import { getters } from "../getters/game";

const state: () => IGameState = () => ({
  horses: [],
  rounds: [],
  results: [],
  isGenerated: false,
  isRacing: false,
  currentRound: 0,
  surface: null,
  track: null,
  settings: {
    isMusicEnabled: true,
    isSoundEnabled: true,
    isFullscreenEnabled: false,
  },
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
