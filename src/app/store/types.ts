import type { ActionContext } from "vuex";

import type { TSurface } from "@/shared/constants";
import type {
  IGrandFinalResults,
  IHorse,
  IRaceHorse,
  IRaceState,
  IResult,
  IRound,
  IRoundPoints,
  ISettings,
  ITrackCondition,
} from "@/shared/types";

export interface IGameState {
  horses: IHorse[];
  rounds: IRound[];
  results: IResult[];
  isGenerated: boolean;
  isRacing: boolean;
  currentRound: number;
  surface: TSurface | null;
  track: ITrackCondition | null;
  settings: ISettings;
  raceState: IRaceState;
  lastFinishedRoundId: number | null;
  grandFinalResults: IGrandFinalResults[];
  roundPoints: IRoundPoints[];
}

export interface IGameMutations {
  [key: string]: any;
  SET_HORSES(state: IGameState, horses: IHorse[]): void;
  SET_ROUNDS(state: IGameState, rounds: IRound[]): void;
  SET_RESULTS(state: IGameState, results: IResult[]): void;
  SET_IS_RACING(state: IGameState, isRacing: boolean): void;
  SET_CURRENT_ROUND(state: IGameState, round: number): void;
  SET_TRACK(state: IGameState, track: ITrackCondition): void;
  TOGGLE_MUSIC(state: IGameState): void;
  TOGGLE_SOUND(state: IGameState): void;
  TOGGLE_FULLSCREEN(state: IGameState): void;
  UPDATE_SETTINGS(state: IGameState, settings: Partial<ISettings>): void;
  RESET_GAME(state: IGameState): void;
  SET_RACE_STATE(state: IGameState, raceState: Partial<IRaceState>): void;
  UPDATE_RACE_HORSES(state: IGameState, horses: IRaceHorse[]): void;
  PAUSE_RACE(state: IGameState): void;
  RESUME_RACE(state: IGameState): void;
  FINISH_RACE(state: IGameState, results: string[]): void;
  SET_LAST_FINISHED_ROUND(state: IGameState, roundId: number | null): void;
  SET_GRAND_FINAL_RESULTS(state: IGameState, results: IGrandFinalResults[]): void;
}

export interface IGameActions {
  [key: string]: any;
  generateHorses(context: ActionContext<IGameState, Record<string, unknown>>): Promise<void>;
  generateRandomTrack(
    context: ActionContext<IGameState, Record<string, unknown>>,
  ): Promise<ITrackCondition>;
  generateRaceSchedule(
    context: ActionContext<IGameState, Record<string, unknown>>,
  ): Promise<IRound[]>;
  toggleMusic(context: ActionContext<IGameState, Record<string, unknown>>): Promise<void>;
  toggleSound(context: ActionContext<IGameState, Record<string, unknown>>): Promise<void>;
  toggleFullscreen(context: ActionContext<IGameState, Record<string, unknown>>): Promise<void>;
  updateSettings(
    context: ActionContext<IGameState, Record<string, unknown>>,
    settings: Partial<ISettings>,
  ): Promise<void>;
  resetGame(context: ActionContext<IGameState, Record<string, unknown>>): Promise<void>;
  startRace(
    context: ActionContext<IGameState, Record<string, unknown>>,
    roundId: number,
  ): Promise<void>;
  pauseRace(context: ActionContext<IGameState, Record<string, unknown>>): Promise<void>;
  resumeRace(context: ActionContext<IGameState, Record<string, unknown>>): Promise<void>;
  finishRace(
    context: ActionContext<IGameState, Record<string, unknown>>,
    results: string[],
  ): Promise<void>;
  updateHorsePositions(
    context: ActionContext<IGameState, Record<string, unknown>>,
    positions: IRaceHorse[],
  ): Promise<void>;
  nextRound(context: ActionContext<IGameState, Record<string, unknown>>): Promise<void>;
  calculateGrandFinalResults(
    context: ActionContext<IGameState, Record<string, unknown>>,
  ): Promise<void>;
  clearLastFinishedRound(
    context: ActionContext<IGameState, Record<string, unknown>>,
  ): Promise<void>;
}

export interface IGameGetters {
  [key: string]: any;
  horses: (state: IGameState) => IHorse[];
  rounds: (state: IGameState) => IRound[];
  results: (state: IGameState) => IResult[];
  isGenerated: (state: IGameState) => boolean;
  isRacing: (state: IGameState) => boolean;
  currentRound: (state: IGameState) => number;
  track: (state: IGameState) => ITrackCondition | null;
  surface: (state: IGameState) => TSurface | null;
  settings: (state: IGameState) => ISettings;
  isMusicEnabled: (state: IGameState) => boolean;
  isSoundEnabled: (state: IGameState) => boolean;
  isFullscreenEnabled: (state: IGameState) => boolean;
  raceState: (state: IGameState) => IRaceState;
  lastFinishedRoundId: (state: IGameState) => number | null;
  grandFinalResults: (state: IGameState) => IGrandFinalResults[];
  roundPoints: (state: IGameState) => IRoundPoints[];
}
