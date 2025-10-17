import type { TSurface } from "@/shared/constants";
import type { IHorse, IRaceHorse, ITrackCondition } from "@/shared/types";
import type { AppStore } from "@/shared/types/store";

import { PX_PER_METER, TRACK_CONFIG } from "../constants";
import type { RaceCanvasRenderer } from "./RaceCanvasRenderer";
import type { RaceEngine } from "./RaceEngine";

export interface RacePageDataManagerConfig {
  getStore: () => AppStore;
  getCanvasRenderer: () => RaceCanvasRenderer;
  getRaceEngine: () => RaceEngine;
}

export interface RaceStateData {
  isRaceActive: boolean;
  isPaused: boolean;
  currentRaceHorses: IRaceHorse[];
  raceDistance: number;
}

export interface HorseDisplayData {
  horseId: string;
  position: number;
  color: string;
  name: string;
  isFinished: boolean;
  finishTime?: number;
}

export interface HudDisplayData {
  round: number | string;
  trackLabel: string;
  distance: number;
  progress: number;
  standings: HorseDisplayData[];
}

export interface HorseStyle extends Record<string, string | number | undefined> {
  transform: string;
  zIndex?: number;
  opacity?: number;
  width?: string;
  height?: string;
}

export class RacePageDataManager {
  private config: RacePageDataManagerConfig;

  constructor(config: RacePageDataManagerConfig) {
    this.config = config;
  }

  getRaceState(): RaceStateData {
    const store = this.config.getStore();
    const raceState = store.getters["game/raceState"];

    // Handle null/undefined raceState gracefully
    if (!raceState) {
      return {
        isRaceActive: false,
        isPaused: false,
        currentRaceHorses: [],
        raceDistance: 1200,
      };
    }

    return {
      isRaceActive: raceState.isRaceActive,
      isPaused: raceState.isPaused,
      currentRaceHorses: raceState.currentRaceHorses || [],
      raceDistance: raceState.raceDistance || 1200,
    };
  }

  getHorses(): IHorse[] {
    const store = this.config.getStore();
    return store.getters["game/horses"] || [];
  }

  getTrack(): ITrackCondition {
    const store = this.config.getStore();
    return store.getters["game/track"];
  }

  getSurface(): TSurface {
    const store = this.config.getStore();
    return store.getters["game/surface"] || "turf";
  }

  getCurrentRound(): number {
    const store = this.config.getStore();
    return store.getters["game/currentRound"];
  }

  getRaceHorses(): IRaceHorse[] {
    const store = this.config.getStore();
    const raceState = this.getRaceState();
    return store.getters["game/currentRaceHorses"] || raceState.currentRaceHorses || [];
  }

  getHorseById(horseId: string): IHorse | null {
    const horses = this.getHorses();
    return horses.find((h) => h.id === horseId) || null;
  }

  getHorseColor(horseId: string): string {
    const horse = this.getHorseById(horseId);
    return horse?.color ?? "#ccc";
  }

  getTrackLabel(): string {
    const track = this.getTrack();
    if (!track) return "Track pending";
    return `${track.surface} ${track.condition}`;
  }

  getHorseStyle(raceHorse: IRaceHorse, isPreRacePhase: boolean, raceStartTime: number): HorseStyle {
    const canvasRenderer = this.config.getCanvasRenderer();
    const raceEngine = this.config.getRaceEngine();
    const raceHorses = this.getRaceHorses();

    const m = canvasRenderer.trackMetricsData;
    if (!m) return { transform: "translate3d(-9999px,-9999px,0)" };

    const idx = raceHorses.findIndex((i) => i.horseId === raceHorse.horseId);
    if (idx === -1) return { transform: "translate3d(-9999px,-9999px,0)" };

    const laneIndex = ((idx % TRACK_CONFIG.lanes) + TRACK_CONFIG.lanes) % TRACK_CONFIG.lanes;
    const laneY = m.laneCenters[laneIndex] ?? m.top + m.laneHeight / 2;

    let screenX: number;
    let screenY = laneY - m.horseSize / 2;

    if (isPreRacePhase && !raceEngine.isCountdownCompleteState) {
      const elapsed = (performance.now() - raceStartTime) / 1000;
      if (elapsed < 4) {
        const progress = Math.min(elapsed / 4, 1);
        const startX = 0;
        const endX = canvasRenderer.canvasState.viewportW / 3 - m.horseSize;
        screenX = startX + (endX - startX) * progress;
      } else {
        screenX = canvasRenderer.canvasState.viewportW / 3 - m.horseSize;
      }
    } else {
      const now = performance.now();
      const dtSinceTick = Math.max(0, (now - raceEngine.lastTickTs) / 1000);
      const lastPx =
        raceEngine.horseLastSpeedMap.get(raceHorse.horseId) ??
        canvasRenderer.canvasState.worldTrackSpeed;
      const extraMeters = (lastPx / PX_PER_METER) * dtSinceTick;

      const posMeters = raceHorse.position + extraMeters;
      const worldX = canvasRenderer.worldDimensions.startX + posMeters * PX_PER_METER;
      screenX = worldX - canvasRenderer.canvasState.cameraOffset;
    }

    return {
      transform: `translate3d(${screenX}px, ${screenY}px, 0)`,
      width: `${m.horseSize}px`,
      height: `${m.horseSize}px`,
    };
  }

  getHudDisplayData(): HudDisplayData {
    const raceEngine = this.config.getRaceEngine();
    const raceHorses = this.getRaceHorses();
    const horses = this.getHorses();
    const currentRound = this.getCurrentRound();
    const trackLabel = this.getTrackLabel();
    const raceDistance = this.getRaceState().raceDistance;

    const sortedHorses = [...raceHorses].sort((a, b) => {
      if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime;
      if (a.finishTime) return -1;
      if (b.finishTime) return 1;
      return b.position - a.position;
    });

    const standings = sortedHorses.slice(0, 6).map((rh, i) => {
      const h = horses.find((x) => x.id === rh.horseId);
      return {
        horseId: rh.horseId,
        position: i + 1,
        color: h?.color ?? "#ccc",
        name: h?.name ?? "Unknown",
        isFinished: rh.isFinished,
        finishTime: rh.finishTime,
      };
    });

    return {
      round: currentRound || "-",
      trackLabel,
      distance: raceDistance,
      progress: raceEngine.currentRaceProgress,
      standings,
    };
  }

  validateRaceData(): boolean {
    const raceState = this.getRaceState();
    const horses = this.getHorses();
    const raceHorses = this.getRaceHorses();

    if (!raceState.isRaceActive) return false;

    const validRaceHorses = raceHorses.every((rh) => horses.some((h) => h.id === rh.horseId));

    return validRaceHorses;
  }

  getRaceStatistics(): {
    totalHorses: number;
    finishedHorses: number;
    raceProgress: number;
    averagePosition: number;
  } {
    const raceHorses = this.getRaceHorses();
    const raceEngine = this.config.getRaceEngine();

    const finishedHorses = raceHorses.filter((rh) => rh.isFinished).length;
    const totalHorses = raceHorses.length;
    const averagePosition =
      totalHorses > 0 ? raceHorses.reduce((sum, rh) => sum + rh.position, 0) / totalHorses : 0;

    return {
      totalHorses,
      finishedHorses,
      raceProgress: raceEngine.currentRaceProgress,
      averagePosition,
    };
  }
}
