import { ref } from "vue";
import {
  PX_PER_METER,
  V_PARALLAX,
  DELTA_MIN,
  DELTA_MAX,
  DELTA_AFFINITY_SCALE,
  RACE_TICK_MS,
  FINALIZE_DELAY_MS,
} from "../constants";
import type { IRaceHorse, IHorse, ITrackCondition } from "@/shared/types";
import type { TSurface } from "@/shared/constants";
import { clamp } from "@/shared/utils";
import type { RaceCanvasRenderer } from "./RaceCanvasRenderer";
import type { AppStore, AppRouter } from "@/shared/types/store";

export interface RaceEngineConfig {
  canvasRenderer: RaceCanvasRenderer;
  store: AppStore;
  router: AppRouter;
  playGate: () => void;
  playAllRunSounds: () => void;
  startRunSoundInterval: () => void;
  stopAllRunSounds: () => void;
  getRaceState: () => any;
  getHorses: () => IHorse[];
  getRaceHorses: () => IRaceHorse[];
  getRaceDistance: () => number;
  getIsPaused: () => boolean;
  getTrack: () => ITrackCondition;
}

export interface RaceState {
  isRaceActive: boolean;
  currentRaceHorses: IRaceHorse[];
  raceDistance: number;
  isPaused: boolean;
}

export class RaceEngine {
  private config: RaceEngineConfig;
  private store: AppStore;
  private router: AppRouter;

  public raceProgress = ref(0);
  public isCountdownComplete = ref(false);
  public hasRaceFinalized = ref(false);
  public isParallaxActive = ref(false);

  public lastTickTs = 0;
  private raceUpdateInterval: number | null = null;
  private finalizeTimeoutId: number | null = null;

  private horseDelta = new Map<string, number>();
  private horseLastSpeedPx = new Map<string, number>();
  private horseCache = new Map<string, IHorse>();

  private get raceState() {
    return this.config.getRaceState();
  }

  private get horses() {
    return this.config.getHorses();
  }

  private get raceHorses() {
    return this.config.getRaceHorses();
  }

  private get raceDistance() {
    return this.config.getRaceDistance();
  }

  private get isPaused() {
    return this.config.getIsPaused();
  }

  private get track() {
    return this.config.getTrack();
  }

  constructor(config: RaceEngineConfig) {
    this.config = config;
    this.store = config.store;
    this.router = config.router;
  }

  initialize() {
    this.updateHorseCache();
    this.seedHorseDeltas();
    this.lastTickTs = performance.now();
  }

  startRaceUpdate() {
    if (this.raceUpdateInterval !== null) return;
    this.lastTickTs = performance.now();
    this.raceUpdateInterval = window.setInterval(() => {
      this.updateHorsePositions();
    }, RACE_TICK_MS);
  }

  stopRaceUpdate() {
    if (this.raceUpdateInterval !== null) {
      clearInterval(this.raceUpdateInterval);
      this.raceUpdateInterval = null;
    }
  }

  seedHorseDeltas() {
    this.horseDelta.clear();
    this.updateHorseCache();

    for (const rh of this.raceHorses) {
      const r = Math.random();
      const d = DELTA_MIN + r * (DELTA_MAX - DELTA_MIN);
      this.horseDelta.set(rh.horseId, d);
    }
  }

  private updateHorseCache() {
    this.horseCache.clear();
    for (const horse of this.horses) {
      this.horseCache.set(horse.id, horse);
    }
  }

  updateHorsePositions() {
    if (
      !this.raceState.isRaceActive ||
      this.isPaused ||
      !this.isCountdownComplete.value ||
      this.raceHorses.length === 0
    ) {
      return;
    }

    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastTickTs) / 1000);
    this.lastTickTs = now;

    const trackSurface = (this.track?.surface as TSurface) || "turf";
    const updated = this.raceHorses.map((rh: IRaceHorse) => {
      const h = this.horseCache.get(rh.horseId);
      const baseDelta = this.horseDelta.get(rh.horseId) ?? 0;
      const aff = h?.surfaceAffinity?.[trackSurface] ?? 1;
      const affDelta = (aff - 1) * DELTA_AFFINITY_SCALE;
      const deltaTotal = baseDelta + affDelta;

      const worldAdvancePx = this.config.canvasRenderer.canvasState.worldTrackSpeed + deltaTotal;

      this.horseLastSpeedPx.set(rh.horseId, worldAdvancePx);

      const worldAdvanceMeters = worldAdvancePx / PX_PER_METER;

      let pos = rh.position;
      let finished = rh.isFinished;
      let finishTime = rh.finishTime;

      if (!finished) {
        pos = rh.position + worldAdvanceMeters * dt;
        if (pos >= this.raceDistance) {
          finished = true;
          finishTime = finishTime ?? Date.now();
        }
      } else {
        pos = rh.position + worldAdvanceMeters * dt;
      }

      return {
        ...rh,
        position: pos,
        currentSpeed: worldAdvanceMeters,
        isFinished: finished,
        finishTime,
      };
    });

    const maxPos = updated.length ? Math.max(...updated.map((h) => h.position)) : 0;
    this.raceProgress.value = clamp((maxPos / this.raceDistance) * 100, 0, 100);

    this.store.dispatch("game/updateHorsePositions", updated);

    const allFinished = updated.every((h) => h.isFinished);
    if (allFinished && !this.hasRaceFinalized.value) {
      this.scheduleRaceFinalization(updated);
    }
  }

  scheduleRaceFinalization(horsesSnapshot: IRaceHorse[]) {
    if (this.hasRaceFinalized.value || this.finalizeTimeoutId !== null) return;
    const snapshot = horsesSnapshot.map((h) => ({ ...h }));
    this.finalizeTimeoutId = window.setTimeout(() => {
      void this.finalizeRace(snapshot);
    }, FINALIZE_DELAY_MS);
  }

  async finalizeRace(horsesSnapshot: IRaceHorse[]) {
    if (this.hasRaceFinalized.value) return;
    this.hasRaceFinalized.value = true;

    if (this.finalizeTimeoutId !== null) {
      clearTimeout(this.finalizeTimeoutId);
      this.finalizeTimeoutId = null;
    }

    this.config.stopAllRunSounds();

    const results = [...horsesSnapshot]
      .sort((a, b) => {
        if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime;
        if (a.finishTime) return -1;
        if (b.finishTime) return 1;
        return b.position - a.position;
      })
      .map((h) => h.horseId);

    await this.store.dispatch("game/finishRace", results);
    this.router.push({ name: "race-management" });
  }

  handleCountdownComplete() {
    this.isCountdownComplete.value = true;

    if (this.raceState.isRaceActive) {
      this.config.playGate();

      this.config.canvasRenderer.canvasState.worldTrackSpeed = V_PARALLAX * 0.1;
      this.config.canvasRenderer.canvasState.targetTrackSpeed = V_PARALLAX;

      this.isParallaxActive.value = true;
      this.config.canvasRenderer.setIsParallaxActive(true);
      this.config.canvasRenderer.setPhase("SCROLL");

      this.seedHorseDeltas();
      this.lastTickTs = performance.now();
      this.startRaceUpdate();

      this.config.playAllRunSounds();
      this.config.startRunSoundInterval();
    }
  }

  togglePause() {
    if (this.isPaused) {
      this.store.dispatch("game/resumeRace");
    } else {
      this.store.dispatch("game/pauseRace");
    }
  }

  reset() {
    this.stopRaceUpdate();
    if (this.finalizeTimeoutId !== null) {
      clearTimeout(this.finalizeTimeoutId);
      this.finalizeTimeoutId = null;
    }

    this.raceProgress.value = 0;
    this.hasRaceFinalized.value = false;
    this.isParallaxActive.value = false;
    this.horseLastSpeedPx.clear();
  }

  onRaceStateChange(isActive: boolean) {
    if (isActive) {
      this.raceProgress.value = 0;
      this.hasRaceFinalized.value = false;
      this.isParallaxActive.value = this.isCountdownComplete.value && !this.isPaused;

      if (this.isCountdownComplete.value) {
        this.lastTickTs = performance.now();
        this.startRaceUpdate();
      }
    } else {
      this.stopRaceUpdate();
      this.isParallaxActive.value = false;
      this.horseLastSpeedPx.clear();
    }
  }

  onPauseStateChange(isPaused: boolean) {
    if (isPaused) {
      this.stopRaceUpdate();
      this.config.canvasRenderer.canvasState.targetTrackSpeed = 0;
    } else if (this.raceState.isRaceActive) {
      this.lastTickTs = performance.now();
      this.startRaceUpdate();
      this.config.canvasRenderer.canvasState.targetTrackSpeed = V_PARALLAX;
    }
  }

  destroy() {
    this.stopRaceUpdate();
    if (this.finalizeTimeoutId !== null) {
      clearTimeout(this.finalizeTimeoutId);
      this.finalizeTimeoutId = null;
    }
    this.horseDelta.clear();
    this.horseLastSpeedPx.clear();
  }

  get currentRaceProgress() {
    return this.raceProgress.value;
  }

  get isCountdownCompleteState() {
    return this.isCountdownComplete.value;
  }

  get hasRaceFinalizedState() {
    return this.hasRaceFinalized.value;
  }

  get isParallaxActiveState() {
    return this.isParallaxActive.value;
  }

  get horseDeltaMap() {
    return this.horseDelta;
  }

  get horseLastSpeedMap() {
    return this.horseLastSpeedPx;
  }
}
