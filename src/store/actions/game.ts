import type { ActionContext } from "vuex";
import type { IGameState, IGameActions } from "../types";
import type {
  IHorse,
  IRound,
  ITrackCondition,
  ISettings,
  TDirtCond,
  TTurfCond,
  THybridCond,
  IRaceHorse,
} from "@/utils/types";
import type { TSurface } from "@/constants/race";
import { generateHorses } from "@/generators/horses";
import { ROUND_DISTANCES, HORSES_PER_ROUND, TRACK_CONDITION_MULTIPLIER } from "@/constants/race";
import { affinityToMul, clamp } from "@/utils/math";

type GameActionContext = ActionContext<IGameState, Record<string, any>>;

const generateTrackCondition = (surface: TSurface): ITrackCondition => {
  if (surface === "dirt") {
    const conditions: TDirtCond[] = ["fast", "good", "wet", "muddy"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)] as TDirtCond;
    return { surface: "dirt", condition };
  } else if (surface === "turf") {
    const conditions: TTurfCond[] = ["firm", "good", "soft", "heavy"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)] as TTurfCond;
    return { surface: "turf", condition };
  } else {
    const conditions: THybridCond[] = ["standard", "fast", "wet"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)] as THybridCond;
    return { surface: "hybrid", condition };
  }
};

const selectRandomHorses = (horses: IHorse[], count: number): string[] => {
  const horseIds = horses.map((horse: IHorse) => horse.id);
  const shuffled = [...horseIds].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const BASE_SPEED_MIN = 4.3;
const BASE_SPEED_MAX = 5.6;
const MIN_SPEED = 3.8;
const MAX_SPEED = 6.8;
const SPEED_MULTIPLIER = 1.5;
const ROUND_COUNT = 6;

const calculateHorseSpeed = (horse: IHorse, track: ITrackCondition): number => {
  const conditionAdjusted = clamp(horse.currentCondition, 45, 100);
  const conditionRatio = (conditionAdjusted - 45) / (100 - 45);
  const conditionSpeed = BASE_SPEED_MIN + (BASE_SPEED_MAX - BASE_SPEED_MIN) * conditionRatio;

  const affinityValue = horse.surfaceAffinity[track.surface] ?? 0.5;
  const affinityMultiplier = affinityToMul(affinityValue, 0.92, 1.12);

  const trackMultiplier = TRACK_CONDITION_MULTIPLIER[track.surface]?.[track.condition] ?? 1.0;
  const randomness = 0.99 + Math.random() * 0.03; // 0.99 - 1.02

  const speed = conditionSpeed * affinityMultiplier * trackMultiplier * randomness;
  const scaledSpeed = speed * SPEED_MULTIPLIER;
  return clamp(scaledSpeed, MIN_SPEED * SPEED_MULTIPLIER, MAX_SPEED * SPEED_MULTIPLIER);
};

export const actions: IGameActions = {
  async generateHorses({ commit }: GameActionContext): Promise<void> {
    const horses = generateHorses();
    commit("SET_HORSES", horses);
  },

  async generateRandomTrack({ commit }: GameActionContext): Promise<ITrackCondition> {
    const surfaces: TSurface[] = ["dirt", "turf", "hybrid"];
    const randomSurface = surfaces[Math.floor(Math.random() * surfaces.length)] as TSurface;
    const track = generateTrackCondition(randomSurface);

    commit("SET_TRACK", track);
    return track;
  },

  async generateRaceSchedule({ commit, state }: GameActionContext): Promise<IRound[]> {
    const rounds: IRound[] = [];

    for (let i = 0; i < ROUND_COUNT; i++) {
      const surfaces: TSurface[] = ["dirt", "turf", "hybrid"];
      const randomSurface = surfaces[Math.floor(Math.random() * surfaces.length)] as TSurface;
      const distance = ROUND_DISTANCES[i];

      if (!distance) {
        throw new Error(`No distance defined for round ${i + 1}`);
      }

      const track = generateTrackCondition(randomSurface);
      const participants = selectRandomHorses(state.horses, HORSES_PER_ROUND);

      rounds.push({
        id: i + 1,
        distance,
        surface: randomSurface,
        track,
        participants,
      });
    }

    commit("SET_ROUNDS", rounds);
    return rounds;
  },

  async toggleMusic({ commit }: GameActionContext): Promise<void> {
    commit("TOGGLE_MUSIC");
  },

  async toggleSound({ commit }: GameActionContext): Promise<void> {
    commit("TOGGLE_SOUND");
  },

  async toggleFullscreen({ commit }: GameActionContext): Promise<void> {
    commit("TOGGLE_FULLSCREEN");
  },

  async updateSettings({ commit }: GameActionContext, settings: Partial<ISettings>): Promise<void> {
    commit("UPDATE_SETTINGS", settings);
  },

  async resetGame({ commit }: GameActionContext): Promise<void> {
    commit("RESET_GAME");
  },

  async startRace({ commit, state }: GameActionContext, roundId: number): Promise<void> {
    const round = state.rounds.find((r) => r.id === roundId);
    if (!round) throw new Error(`Round ${roundId} not found`);

    const updatedHorses = state.horses.map((horse) => {
      if (round.participants.includes(horse.id)) {
        const roundsSinceLastRace = horse.lastRaceRound
          ? roundId - horse.lastRaceRound
          : ROUND_COUNT;
        const recoveryAmount = Math.min(roundsSinceLastRace * 5, 20);

        return {
          ...horse,
          currentCondition: Math.min(100, horse.currentCondition + recoveryAmount),
          lastRaceRound: roundId,
        };
      }
      return horse;
    });

    if (updatedHorses !== state.horses) {
      commit("SET_HORSES", updatedHorses);
    }

    commit("SET_CURRENT_ROUND", roundId);
    commit("SET_TRACK", round.track);

    const raceHorses: IRaceHorse[] = round.participants.map((horseId) => {
      const horse = updatedHorses.find((h) => h.id === horseId);
      if (!horse) throw new Error(`Horse ${horseId} not found`);

      const baseSpeed = calculateHorseSpeed(horse, round.track);
      return {
        horseId,
        position: 0,
        speed: baseSpeed,
        currentSpeed: baseSpeed,
        isFinished: false,
      };
    });

    commit("SET_RACE_STATE", {
      isRaceActive: true,
      isPaused: false,
      currentRaceHorses: raceHorses,
      raceDistance: round.distance,
      finishLineX: 0,
      raceStartTime: Date.now(),
    });
  },

  async pauseRace({ commit }: GameActionContext): Promise<void> {
    commit("PAUSE_RACE");
  },

  async resumeRace({ commit }: GameActionContext): Promise<void> {
    commit("RESUME_RACE");
  },

  async finishRace({ commit, state }: GameActionContext, results: string[]): Promise<void> {
    commit("FINISH_RACE", results);

    const horses = [...state.horses];
    results.forEach((horseId, index) => {
      const horseIndex = horses.findIndex((h) => h.id === horseId);
      if (horseIndex !== -1) {
        const conditionDecrease = (results.length - index) * 2 + Math.random() * 5;
        const horse = state.horses[horseIndex];
        if (horse) {
          horses[horseIndex] = {
            ...horse,
            currentCondition: Math.max(horse.currentCondition - conditionDecrease, 30),
            lastRaceRound: state.currentRound,
          };
        }
      }
    });
    commit("SET_HORSES", horses);
  },

  async updateHorsePositions(
    { commit }: GameActionContext,
    positions: IRaceHorse[],
  ): Promise<void> {
    commit("UPDATE_RACE_HORSES", positions);
  },

  async nextRound({ commit, state }: GameActionContext): Promise<void> {
    const nextRoundId = state.currentRound + 1;

    if (nextRoundId <= state.rounds.length) {
      commit("SET_CURRENT_ROUND", nextRoundId);

      const nextRound = state.rounds.find((r) => r.id === nextRoundId);
      if (nextRound) {
        commit("SET_TRACK", nextRound.track);
      }
    }
  },
};
