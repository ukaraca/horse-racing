<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useStore as useVuexStore } from "vuex";
import { useRouter } from "vue-router";

import { Countdown, RaceHud } from "../components";
import { useFullscreen, useAudio, useNavigation, useStore } from "@/shared/composables";
import { PlayIcon, PauseIcon } from "@/shared/components/ui/icons";
import type { IRaceHorse, IHorse } from "@/shared/types";
import type { TSurface, AudioKey } from "@/shared/constants";
import { PX_PER_METER } from "../constants";
import {
  RaceCanvasRenderer,
  RaceEngine,
  RacePageDataManager,
  RacePageRenderer,
  RacePageAudioManager,
} from "../utils";

const store = useVuexStore();
const router = useRouter();

const { getGetter, dispatchAction, GAME_GETTERS, GAME_ACTIONS } = useStore();
const { navigateTo, ROUTE_NAMES } = useNavigation();

const { isFullscreen } = useFullscreen();
const {
  isMusicEnabled,
  isSoundEnabled,
  initializeAudio,
  playAudio,
  stopAudio,
  playAllRunSounds,
  stopAllRunSounds,
} = useAudio();

const canvasRef = ref<HTMLCanvasElement | null>(null);

const canvasRenderer = new RaceCanvasRenderer();

const raceEngine = new RaceEngine({
  canvasRenderer,
  store,
  router,
  playGate: () => playAudio("gate"),
  playAllRunSounds: () => playAllRunSounds(),
  startRunSoundInterval: () => startRunSoundInterval(),
  stopAllRunSounds: () => stopAllRunSounds(),
  getRaceState: () => raceState.value,
  getHorses: () => horses.value,
  getRaceHorses: () => raceHorses.value,
  getRaceDistance: () => raceDistance.value,
  getIsPaused: () => isPaused.value,
  getTrack: () => getGetter(GAME_GETTERS.TRACK),
});

const dataManager = new RacePageDataManager({
  getStore: () => store,
  getCanvasRenderer: () => canvasRenderer,
  getRaceEngine: () => raceEngine,
});

const pageRenderer = new RacePageRenderer({
  getCanvasRenderer: () => canvasRenderer,
  getDataManager: () => dataManager,
  getRaceEngine: () => raceEngine,
  getIsPreRacePhase: () => isPreRacePhase.value,
  getRaceStartTime: () => raceStartTime.value,
  getPreRaceFrame: () => preRaceFrame.value,
});

const audioManager = new RacePageAudioManager({
  playAudio: (sound: AudioKey) => playAudio(sound),
  stopAudio: (sound: AudioKey) => stopAudio(sound),
  playAllRunSounds: () => playAllRunSounds(),
  stopAllRunSounds: () => stopAllRunSounds(),
  initializeAudio: () => initializeAudio(),
  isMusicEnabled: () => isMusicEnabled.value,
  isSoundEnabled: () => isSoundEnabled.value,
  getRaceState: () => raceState.value,
  getIsPaused: () => isPaused.value,
});

const handleResize = () => resizeCanvas();
const handleFullscreenChange = () => setTimeout(resizeCanvas, 100);
const handleBlur = () => {
  if (raceState.value.isRaceActive && !isPaused.value) {
    dispatchAction(GAME_ACTIONS.PAUSE_RACE);
    raceEngine.onPauseStateChange(true);
    audioManager.handlePauseStateChange(true, raceState.value.isRaceActive);
  }
};
const handleFocus = () => {
  if (raceState.value.isRaceActive && isPaused.value) {
    dispatchAction(GAME_ACTIONS.RESUME_RACE);
    raceEngine.onPauseStateChange(false);
    audioManager.handlePauseStateChange(false, raceState.value.isRaceActive);
  }
};

const isPreRacePhase = ref(false);
let preRaceAnimationId: number | null = null;

const surface = computed(() => (getGetter(GAME_GETTERS.SURFACE) as TSurface) || "turf");
const raceState = computed(() => getGetter(GAME_GETTERS.RACE_STATE));

const horses = computed(() => getGetter(GAME_GETTERS.HORSES) as IHorse[]);

const isPaused = computed(() => raceState.value.isPaused);
const raceHorses = computed(
  () =>
    (getGetter(GAME_GETTERS.CURRENT_RACE_HORSES) as IRaceHorse[]) ||
    raceState.value.currentRaceHorses,
);
const raceDistance = computed(() => raceState.value.raceDistance || 1200);

const hudRenderData = computed(() => pageRenderer.getHudRenderData());
const raceControlsRenderData = computed(() => pageRenderer.getRaceControlsRenderData());

let raceStartTime = ref(0);
const getHorseColor = (horseId: string): string => {
  return dataManager.getHorseColor(horseId);
};

const startRunSoundInterval = () => {
  audioManager.startRunSoundInterval();
};

const preRaceFrame = ref(0);
const forcePreRaceUpdate = () => {
  if (isPreRacePhase.value) {
    preRaceFrame.value++;
    requestAnimationFrame(forcePreRaceUpdate);
  }
};

const stopPreRaceAnimation = () => {
  if (preRaceAnimationId) {
    cancelAnimationFrame(preRaceAnimationId);
    preRaceAnimationId = null;
  }
};

const getHorseStyle = (raceHorse: IRaceHorse) => {
  return dataManager.getHorseStyle(raceHorse, isPreRacePhase.value, raceStartTime.value);
};

const togglePause = () => {
  raceEngine.togglePause();
};

const handleCountdownComplete = () => {
  isPreRacePhase.value = false;
  raceEngine.handleCountdownComplete();
};

function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  canvasRenderer.initializeCanvas(canvas, w, h, surface.value, raceDistance.value);
}

watch(
  () => raceState.value.isRaceActive,
  (isActive) => {
    raceEngine.onRaceStateChange(isActive);
  },
  { immediate: true },
);

watch(
  () => isPaused.value,
  (p) => {
    canvasRenderer.setIsPaused(p);
    raceEngine.onPauseStateChange(p);
    audioManager.handlePauseStateChange(p, raceState.value.isRaceActive);
  },
  { immediate: true },
);

watch(
  () => isFullscreen.value,
  () => {
    setTimeout(() => resizeCanvas(), 100);
  },
);

watch(
  () => isMusicEnabled.value,
  () => {
    audioManager.onMusicSettingChange(raceState.value.isRaceActive);
  },
);

watch(
  () => isSoundEnabled.value,
  () => {
    audioManager.onSoundSettingChange(raceState.value.isRaceActive);
  },
);

onMounted(() => {
  if (!raceState.value.isRaceActive) {
    navigateTo(ROUTE_NAMES.RACE_MANAGEMENT);
    return;
  }

  resizeCanvas();
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("fullscreenchange", handleFullscreenChange, { passive: true });
  window.addEventListener("blur", handleBlur);
  window.addEventListener("focus", handleFocus);

  raceEngine.initialize();

  if (canvasRef.value) {
    canvasRenderer.startRender(canvasRef.value);
  }

  audioManager.initialize();
  audioManager.startRaceAudio();

  isPreRacePhase.value = true;
  raceStartTime.value = performance.now();
  forcePreRaceUpdate();

  setTimeout(() => {
    isPreRacePhase.value = false;
    stopPreRaceAnimation();

    const startLinePixels =
      canvasRenderer.canvasState.viewportW / 3 - canvasRenderer.trackMetricsData?.horseSize!;

    const world = canvasRenderer.worldDimensions;
    world.startX = startLinePixels;
    world.finishX = world.startX + raceDistance.value * PX_PER_METER;
  }, 4000);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  window.removeEventListener("blur", handleBlur);
  window.removeEventListener("focus", handleFocus);

  canvasRenderer.stopRender();

  raceEngine.destroy();

  audioManager.cleanup();

  stopPreRaceAnimation();
});
</script>

<template>
  <div class="race-track">
    <canvas ref="canvasRef" class="race-canvas"></canvas>

    <div
      class="race-controls"
      v-if="raceControlsRenderData.isVisible && raceControlsRenderData.isCountdownComplete"
    >
      <button @click="togglePause" class="pause-btn">
        <PlayIcon v-if="raceControlsRenderData.isPaused" />
        <PauseIcon v-else />
      </button>
    </div>

    <RaceHud :hud-data="hudRenderData" />

    <div
      v-if="raceState.isRaceActive || isPreRacePhase"
      :key="`horses-${preRaceFrame}`"
      class="horses-container"
      :class="{ 'horses-container--paused': isPaused }"
    >
      <div
        v-for="raceHorse in raceHorses"
        :key="raceHorse.horseId"
        class="horse-element"
        :style="getHorseStyle(raceHorse)"
      >
        <div
          class="horse-square"
          :style="{
            backgroundColor: getHorseColor(raceHorse.horseId),
            width: `${canvasRenderer.trackMetricsData?.horseSize || 40}px`,
            height: `${canvasRenderer.trackMetricsData?.horseSize || 40}px`,
            fontSize: `${Math.max(10, (canvasRenderer.trackMetricsData?.horseSize || 40) * 0.3)}px`,
          }"
        >
          <span class="horse-id-label">{{ raceHorse.horseId }}</span>
        </div>
      </div>
    </div>

    <Countdown
      v-if="!raceEngine.isCountdownCompleteState && !isPreRacePhase"
      @complete="handleCountdownComplete"
    />
  </div>
</template>

<style scoped lang="scss">
.race-track {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: $background;
}
.race-canvas {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}
.race-controls {
  position: absolute;
  top: 6rem;
  right: $spacing-lg;
  z-index: 30;
}
.pause-btn {
  width: 48px;
  height: 48px;
  background: $primary;
  color: $white;
  border: 2px solid $black;
  border-radius: $radius-sm;
  cursor: pointer;
  box-shadow: 2px 2px 0 $black-60;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
}
.pause-btn:hover {
  background: $primary-dark;
  transform: translate(2px, 2px);
}

.horses-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.horse-element {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transform: translate3d(-9999px, -9999px, 0);
  transition: transform 0.12s linear;
  will-change: transform;
}

.horse-square {
  border: 2px solid $white;
  border-radius: $radius-sm;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: $font-weight-bold;
  color: $black;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}
.horse-id-label {
  font-family: monospace;
  font-size: $font-size-sm;
}
</style>
