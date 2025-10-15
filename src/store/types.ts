import type { ActionContext } from "vuex";
import type {
  IHorse,
  IRound,
  IResult,
  ITrackCondition,
  ISettings,
  IRaceState,
  IRaceHorse,
} from "@/utils/types";
import type { TSurface } from "@/constants/race";

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
}

export interface IGameMutations {
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
}

export interface IGameActions {
  generateHorses(context: ActionContext<IGameState, Record<string, any>>): Promise<void>;
  generateRandomTrack(
    context: ActionContext<IGameState, Record<string, any>>,
  ): Promise<ITrackCondition>;
  generateRaceSchedule(context: ActionContext<IGameState, Record<string, any>>): Promise<IRound[]>;
  toggleMusic(context: ActionContext<IGameState, Record<string, any>>): Promise<void>;
  toggleSound(context: ActionContext<IGameState, Record<string, any>>): Promise<void>;
  toggleFullscreen(context: ActionContext<IGameState, Record<string, any>>): Promise<void>;
  updateSettings(
    context: ActionContext<IGameState, Record<string, any>>,
    settings: Partial<ISettings>,
  ): Promise<void>;
  resetGame(context: ActionContext<IGameState, Record<string, any>>): Promise<void>;
  startRace(
    context: ActionContext<IGameState, Record<string, any>>,
    roundId: number,
  ): Promise<void>;
  pauseRace(context: ActionContext<IGameState, Record<string, any>>): Promise<void>;
  resumeRace(context: ActionContext<IGameState, Record<string, any>>): Promise<void>;
  finishRace(
    context: ActionContext<IGameState, Record<string, any>>,
    results: string[],
  ): Promise<void>;
  updateHorsePositions(
    context: ActionContext<IGameState, Record<string, any>>,
    positions: IRaceHorse[],
  ): Promise<void>;
  nextRound(context: ActionContext<IGameState, Record<string, any>>): Promise<void>;
}

export interface IGameGetters {
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
}
