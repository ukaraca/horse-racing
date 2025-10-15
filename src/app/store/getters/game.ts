import type { IGameState, IGameGetters } from "../types";

export const getters: IGameGetters = {
  horses: (state: IGameState) => state.horses,
  rounds: (state: IGameState) => state.rounds,
  results: (state: IGameState) => state.results,
  isGenerated: (state: IGameState) => state.isGenerated,
  isRacing: (state: IGameState) => state.isRacing,
  currentRound: (state: IGameState) => state.currentRound,
  track: (state: IGameState) => state.track,
  surface: (state: IGameState) => state.surface,
  settings: (state: IGameState) => state.settings,
  isMusicEnabled: (state: IGameState) => state.settings.isMusicEnabled,
  isSoundEnabled: (state: IGameState) => state.settings.isSoundEnabled,
  isFullscreenEnabled: (state: IGameState) => state.settings.isFullscreenEnabled,
  raceState: (state: IGameState) => state.raceState,
  lastFinishedRoundId: (state: IGameState) => state.lastFinishedRoundId,
  grandFinalResults: (state: IGameState) => state.grandFinalResults,
  roundPoints: (state: IGameState) => state.roundPoints,
};
