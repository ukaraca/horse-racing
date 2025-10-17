import type { IRaceHorse } from "@/shared/types";

import type { RaceCanvasRenderer } from "./RaceCanvasRenderer";
import type { RaceEngine } from "./RaceEngine";
import type { HorseStyle, RacePageDataManager } from "./RacePageDataManager";

export interface RacePageRendererConfig {
  getCanvasRenderer: () => RaceCanvasRenderer;
  getDataManager: () => RacePageDataManager;
  getRaceEngine: () => RaceEngine;
  getIsPreRacePhase: () => boolean;
  getRaceStartTime: () => number;
  getPreRaceFrame: () => number;
}

export interface HorseRenderData {
  raceHorse: IRaceHorse;
  style: HorseStyle;
  color: string;
  horseSize: number;
  fontSize: number;
}

export interface HudRenderData {
  isVisible: boolean;
  isCountdownComplete: boolean;
  hudInfo: {
    round: string | number;
    trackLabel: string;
    distance: number;
  };
  progressBar: {
    isVisible: boolean;
    progress: number;
  };
  standings: Array<{
    horseId: string;
    position: number;
    color: string;
    name: string;
    isPodium: boolean;
  }>;
}

export interface HorseSquareStyle {
  backgroundColor: string;
  width: string;
  height: string;
  border: string;
  borderRadius: string;
  fontSize: string;
}

export class RacePageRenderer {
  private config: RacePageRendererConfig;

  constructor(config: RacePageRendererConfig) {
    this.config = config;
  }

  getHorsesRenderData(): HorseRenderData[] {
    const dataManager = this.config.getDataManager();
    const raceHorses = dataManager.getRaceHorses();
    const isPreRacePhase = this.config.getIsPreRacePhase();
    const raceStartTime = this.config.getRaceStartTime();
    const canvasRenderer = this.config.getCanvasRenderer();

    return raceHorses.map((raceHorse: IRaceHorse) => {
      const style = dataManager.getHorseStyle(raceHorse, isPreRacePhase, raceStartTime);
      const color = dataManager.getHorseColor(raceHorse.horseId);
      const horseSize = canvasRenderer.trackMetricsData?.horseSize || 40;
      const fontSize = Math.max(10, horseSize * 0.3);

      return {
        raceHorse,
        style,
        color,
        horseSize,
        fontSize,
      };
    });
  }

  getHudRenderData(): HudRenderData {
    const dataManager = this.config.getDataManager();
    const raceEngine = this.config.getRaceEngine();
    const raceState = dataManager.getRaceState();

    const hudDisplayData = dataManager.getHudDisplayData();
    const isCountdownComplete = raceEngine?.isCountdownCompleteState || false;

    return {
      isVisible: raceState.isRaceActive,
      isCountdownComplete,
      hudInfo: {
        round: hudDisplayData.round,
        trackLabel: hudDisplayData.trackLabel,
        distance: hudDisplayData.distance,
      },
      progressBar: {
        isVisible: isCountdownComplete,
        progress: hudDisplayData.progress,
      },
      standings: hudDisplayData.standings.map((standing) => ({
        horseId: standing.horseId,
        position: standing.position,
        color: standing.color,
        name: standing.name,
        isPodium: standing.position <= 3,
      })),
    };
  }

  getRaceControlsRenderData(): {
    isVisible: boolean;
    isCountdownComplete: boolean;
    isPaused: boolean;
  } {
    const dataManager = this.config.getDataManager();
    const raceEngine = this.config.getRaceEngine();
    const raceState = dataManager.getRaceState();

    return {
      isVisible: raceState.isRaceActive,
      isCountdownComplete: raceEngine?.isCountdownCompleteState || false,
      isPaused: raceState.isPaused,
    };
  }

  getCountdownRenderData(): {
    isVisible: boolean;
    isCountdownComplete: boolean;
    isPreRacePhase: boolean;
  } {
    const raceEngine = this.config.getRaceEngine();
    const isPreRacePhase = this.config.getIsPreRacePhase();
    const isCountdownComplete = raceEngine?.isCountdownCompleteState || false;

    return {
      isVisible: !isCountdownComplete && !isPreRacePhase,
      isCountdownComplete,
      isPreRacePhase,
    };
  }

  getHorsesContainerRenderData(): {
    isVisible: boolean;
    isPreRacePhase: boolean;
    isPaused: boolean;
    preRaceFrame: number;
  } {
    const dataManager = this.config.getDataManager();
    const raceState = dataManager.getRaceState();
    const isPreRacePhase = this.config.getIsPreRacePhase();
    const preRaceFrame = this.config.getPreRaceFrame();

    return {
      isVisible: raceState.isRaceActive || isPreRacePhase,
      isPreRacePhase,
      isPaused: raceState.isPaused,
      preRaceFrame,
    };
  }

  getCanvasRenderData(): {
    canvasRef: string;
    canvasClass: string;
  } {
    return {
      canvasRef: "canvasRef",
      canvasClass: "race-canvas",
    };
  }

  getHorseSquareStyle(horseRenderData: HorseRenderData): HorseSquareStyle {
    return {
      backgroundColor: horseRenderData.color,
      width: `${horseRenderData.horseSize}px`,
      height: `${horseRenderData.horseSize}px`,
      fontSize: `${horseRenderData.fontSize}px`,
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "4px",
    };
  }

  getStandingChipClass(isPodium: boolean): string {
    return `standing-chip ${isPodium ? "standing-chip--podium" : ""}`;
  }

  getHorsesContainerClass(isPaused: boolean): string {
    return `horses-container ${isPaused ? "horses-container--paused" : ""}`;
  }

  validateRenderData(): boolean {
    const dataManager = this.config.getDataManager();
    const canvasRenderer = this.config.getCanvasRenderer();

    if (!dataManager || !canvasRenderer) return false;

    if (!canvasRenderer.trackMetricsData) return false;

    return dataManager.validateRaceData();
  }

  getRenderStatistics(): {
    horsesCount: number;
    standingsCount: number;
    isPreRacePhase: boolean;
    isCountdownComplete: boolean;
    trackMetricsAvailable: boolean;
  } {
    const horsesRenderData = this.getHorsesRenderData();
    const hudRenderData = this.getHudRenderData();
    const canvasRenderer = this.config.getCanvasRenderer();
    const raceEngine = this.config.getRaceEngine();

    return {
      horsesCount: horsesRenderData.length,
      standingsCount: hudRenderData.standings.length,
      isPreRacePhase: this.config.getIsPreRacePhase(),
      isCountdownComplete: raceEngine?.isCountdownCompleteState || false,
      trackMetricsAvailable: !!canvasRenderer.trackMetricsData,
    };
  }
}
