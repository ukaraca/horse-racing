import type { TRoundDistance, TSurface } from "../constants";

export type TDirtCond = "fast" | "good" | "wet" | "muddy";
export type TTurfCond = "firm" | "good" | "soft" | "heavy";
export type THybridCond = "standard" | "fast" | "wet";

export type ITrackCondition =
  | { surface: "dirt"; condition: TDirtCond }
  | { surface: "turf"; condition: TTurfCond }
  | { surface: "hybrid"; condition: THybridCond };

export interface IHorse {
  id: string;
  name: string;
  color: string;
  baseCondition: number;
  currentCondition: number;
  surfaceAffinity: Record<TSurface, number>;
  lastRaceRound?: number;
}

export interface IRound {
  id: number;
  distance: TRoundDistance;
  surface: TSurface;
  track: ITrackCondition;
  participants: string[];
  result?: string[];
}

export interface IResult {
  roundId: number;
  order: string[];
}

export interface IRaceState {
  isRaceActive: boolean;
  isPaused: boolean;
  currentRaceHorses: IRaceHorse[];
  raceDistance: number;
  finishLineX: number;
  raceStartTime: number;
}

export interface IRaceHorse {
  horseId: string;
  position: number;
  speed: number;
  currentSpeed: number;
  isFinished: boolean;
  finishTime?: number;
}

export interface ISettings {
  isMusicEnabled: boolean;
  isSoundEnabled: boolean;
  isFullscreenEnabled: boolean;
}

export interface IGrandFinalResults {
  horseId: string;
  totalPoints: number;
  finalPosition: number;
}

export interface IRoundPoints {
  roundId: number;
  horsePoints: Record<string, number>;
}
