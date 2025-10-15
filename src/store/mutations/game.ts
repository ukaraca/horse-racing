import type { IGameState, IGameMutations } from "../types";
import type {
  IHorse,
  IRound,
  IResult,
  ITrackCondition,
  ISettings,
  IRaceState,
  IRaceHorse,
} from "@/utils/types";

export const mutations: IGameMutations = {
  SET_HORSES(state: IGameState, horses: IHorse[]) {
    state.horses = horses;
    state.isGenerated = true;
  },

  SET_ROUNDS(state: IGameState, rounds: IRound[]) {
    state.rounds = rounds;
  },

  SET_RESULTS(state: IGameState, results: IResult[]) {
    state.results = results;
  },

  SET_IS_RACING(state: IGameState, isRacing: boolean) {
    state.isRacing = isRacing;
  },

  SET_CURRENT_ROUND(state: IGameState, round: number) {
    state.currentRound = round;
  },

  SET_TRACK(state: IGameState, track: ITrackCondition) {
    state.track = track;
    state.surface = track.surface;
  },

  TOGGLE_MUSIC(state: IGameState) {
    state.settings.isMusicEnabled = !state.settings.isMusicEnabled;
  },

  TOGGLE_SOUND(state: IGameState) {
    state.settings.isSoundEnabled = !state.settings.isSoundEnabled;
  },

  TOGGLE_FULLSCREEN(state: IGameState) {
    state.settings.isFullscreenEnabled = !state.settings.isFullscreenEnabled;
  },

  UPDATE_SETTINGS(state: IGameState, settings: Partial<ISettings>) {
    state.settings = { ...state.settings, ...settings };
  },

  RESET_GAME(state: IGameState) {
    state.horses = [];
    state.rounds = [];
    state.results = [];
    state.isGenerated = false;
    state.isRacing = false;
    state.currentRound = 0;
    state.surface = null;
    state.track = null;
    state.raceState = {
      isRaceActive: false,
      isPaused: false,
      currentRaceHorses: [],
      raceDistance: 0,
      finishLineX: 0,
      raceStartTime: 0,
    };
  },

  SET_RACE_STATE(state: IGameState, raceState: Partial<IRaceState>) {
    state.raceState = { ...state.raceState, ...raceState };
  },

  UPDATE_RACE_HORSES(state: IGameState, horses: IRaceHorse[]) {
    state.raceState.currentRaceHorses = horses;
  },

  PAUSE_RACE(state: IGameState) {
    state.raceState.isPaused = true;
  },

  RESUME_RACE(state: IGameState) {
    state.raceState.isPaused = false;
  },

  FINISH_RACE(state: IGameState, results: string[]) {
    state.raceState.isRaceActive = false;
    state.raceState.isPaused = false;

    const round = state.rounds.find((r) => r.id === state.currentRound);
    if (round) {
      round.result = results;
    }

    state.results.push({
      roundId: state.currentRound,
      order: results,
    });
  },
};
