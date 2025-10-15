<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Countdown from "./components/Countdown.vue";
import type { IRaceHorse, IHorse, ITrackCondition } from "@/utils/types";
import type { TSurface } from "@/constants/race";
import { clamp } from "@/utils/math";

const RACE_TICK_MS = 100;
const PARALLAX_SPEED = 2;
const CAMERA_FOCUS_RATIO = 0.5;
const CAMERA_MIN_MARGIN = 180;
const CAMERA_SMOOTHING = 0.15;
const FINALIZE_DELAY_MS = 2000;

const HORSE_VISUAL = {
  width: 40,
  height: 40,
};

const TRACK_CONFIG = {
  lanes: 10,
  laneHeight: 60,
  fenceHeight: 40,
  foregroundFenceHeight: 50,
  skyColor: "#87CEEB",
};

const TRACK_LAYOUT = {
  startOffset: 200,
  endBuffer: 200,
  distanceScale: 2,
};

interface TrackMetrics {
  top: number;
  height: number;
  bottom: number;
  laneCenters: number[];
}

const TRACK_COLORS = {
  turf: {
    ground: "#2d5016",
    groundAlt: "#3a6a1f",
    mountain: "#4a6741",
  },
  dirt: {
    ground: "#8B7355",
    groundAlt: "#a08870",
    mountain: "#6d5d4a",
  },
  hybrid: {
    ground: "#5d7a3a",
    groundAlt: "#708a4d",
    mountain: "#5a6a51",
  },
};

const store = useStore();
const router = useRouter();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const horsesContainerRef = ref<HTMLDivElement | null>(null);

const isCountdownComplete = ref(false);
const raceProgress = ref(0);
const isParallaxActive = ref(false);
const finishSequenceStarted = ref(false);
const hasRaceFinalized = ref(false);

const trackMetrics = ref<TrackMetrics | null>(null);
const trackScale = ref(1);
const cameraOffset = ref(0);

const surface = computed(() => store.getters["game/surface"] || "turf");
const raceState = computed(() => store.getters["game/raceState"]);
const currentRound = computed(() => store.getters["game/currentRound"]);
const horses = computed(() => store.getters["game/horses"] as IHorse[]);
const track = computed(() => store.getters["game/track"] as ITrackCondition);
const trackLabel = computed(() => {
  const currentTrack = track.value;
  if (!currentTrack) return "Track pending";
  return `${currentTrack.surface} ${currentTrack.condition}`;
});

const isPaused = computed(() => raceState.value.isPaused);
const raceHorses = computed(() => raceState.value.currentRaceHorses);

const raceDistance = computed(() => raceState.value.raceDistance || 1200);
const finishLineVisible = computed(() => raceState.value.isRaceActive);
const finishLineX = computed(
  () => TRACK_LAYOUT.startOffset + raceDistance.value * trackScale.value,
);

const liveStandingsDetailed = computed(() => {
  return [...raceHorses.value]
    .sort((a: IRaceHorse, b: IRaceHorse) => {
      if (a.finishTime && b.finishTime) {
        return a.finishTime - b.finishTime;
      }
      if (a.finishTime) return -1;
      if (b.finishTime) return 1;
      return b.position - a.position;
    })
    .map((raceHorse, index) => {
      const horse = horses.value.find((horseItem: IHorse) => horseItem.id === raceHorse.horseId);
      return {
        horseId: raceHorse.horseId,
        position: index + 1,
        color: horse?.color ?? "#ccc",
        name: horse?.name ?? "Unknown",
      };
    });
});

const liveStandingsTop = computed(() => liveStandingsDetailed.value.slice(0, 6));

let animationFrameId = 0;
let scrollOffset = 0;
let raceUpdateInterval: number | null = null;
let finalizeTimeoutId: number | null = null;

const getTrackColors = () =>
  TRACK_COLORS[surface.value as keyof typeof TRACK_COLORS] || TRACK_COLORS.turf;

function computeTrackMetrics(canvasHeight: number): TrackMetrics {
  const trackHeight = TRACK_CONFIG.lanes * TRACK_CONFIG.laneHeight;
  const minTop = 200;
  const top = Math.max(canvasHeight * 0.35, minTop);
  const bottom = top + trackHeight;
  const laneCenters = Array.from({ length: TRACK_CONFIG.lanes }, (_, index) => {
    return top + TRACK_CONFIG.laneHeight * (index + 0.5);
  });
  return { top, height: trackHeight, bottom, laneCenters };
}

function updateTrackMetrics() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  trackMetrics.value = computeTrackMetrics(canvas.height);

  trackScale.value = TRACK_LAYOUT.distanceScale;

  updateCameraOffset(raceHorses.value);
}

const getTotalWorldLength = () =>
  TRACK_LAYOUT.startOffset + raceDistance.value * trackScale.value + TRACK_LAYOUT.endBuffer;

const getMaxCameraOffset = (viewportWidth: number) =>
  Math.max(0, getTotalWorldLength() - viewportWidth);

function updateCameraOffset(horsesList: IRaceHorse[]) {
  if (horsesList.length === 0) {
    cameraOffset.value = 0;
    return;
  }

  const viewportWidth = window.innerWidth || 1280;
  const focusX = viewportWidth * CAMERA_FOCUS_RATIO;
  const leaderProgress = Math.max(...horsesList.map((horse) => horse.position));
  const leaderPx = TRACK_LAYOUT.startOffset + leaderProgress * trackScale.value;
  const desired = Math.max(0, leaderPx - focusX + CAMERA_MIN_MARGIN);
  const maxOffset = getMaxCameraOffset(viewportWidth);
  const nextOffset = cameraOffset.value + (desired - cameraOffset.value) * CAMERA_SMOOTHING;
  cameraOffset.value = clamp(nextOffset, 0, maxOffset);
}

function adjustBrightness(color: string, amount: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount * 255));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount * 255));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount * 255));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function drawMountainRange(
  ctx: CanvasRenderingContext2D,
  width: number,
  baseY: number,
  offset: number,
  scale: number,
) {
  const peaks = 6;
  const peakWidth = (width * 2) / peaks;

  ctx.beginPath();
  ctx.moveTo(-offset, baseY);

  for (let i = 0; i < peaks + 2; i++) {
    const x = i * peakWidth - offset;
    const peakHeight = (Math.sin(i * 0.7) * 60 + 80) * scale;
    const peakY = baseY - peakHeight;

    ctx.lineTo(x + peakWidth / 2, peakY);
    ctx.lineTo(x + peakWidth, baseY);
  }

  ctx.lineTo(width, baseY);
  ctx.closePath();
  ctx.fill();
}

function drawMountains(ctx: CanvasRenderingContext2D, width: number, metrics: TrackMetrics) {
  const offset = (scrollOffset * 0.3) % (width * 2);
  const colors = getTrackColors();

  ctx.fillStyle = adjustBrightness(colors.mountain, -0.2);
  drawMountainRange(ctx, width, metrics.top, offset * 0.5, 0.8);

  ctx.fillStyle = colors.mountain;
  drawMountainRange(ctx, width, metrics.top, offset, 1);
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  metrics: TrackMetrics,
) {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, metrics.top);
  skyGradient.addColorStop(0, "#4a90e2");
  skyGradient.addColorStop(1, TRACK_CONFIG.skyColor);
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, metrics.top);

  drawMountains(ctx, width, metrics);

  const colors = getTrackColors();
  ctx.fillStyle = colors.ground;
  ctx.fillRect(0, metrics.top, width, height - metrics.top);
}

function drawTrack(ctx: CanvasRenderingContext2D, width: number, metrics: TrackMetrics) {
  const colors = getTrackColors();
  ctx.fillStyle = colors.groundAlt;
  ctx.fillRect(0, metrics.top, width, metrics.height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;

  for (let i = 0; i <= TRACK_CONFIG.lanes; i++) {
    const y = metrics.top + i * TRACK_CONFIG.laneHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawFence(ctx: CanvasRenderingContext2D, width: number, metrics: TrackMetrics) {
  const postWidth = 8;
  const postSpacing = 40;
  const offset = scrollOffset % postSpacing;

  const drawFenceRow = (baseY: number) => {
    for (let x = -offset; x < width + postSpacing; x += postSpacing) {
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(
        x - postWidth / 2,
        baseY - TRACK_CONFIG.fenceHeight,
        postWidth,
        TRACK_CONFIG.fenceHeight,
      );

      ctx.fillStyle = "#6d4c41";
      ctx.fillRect(x - postWidth / 2, baseY - TRACK_CONFIG.fenceHeight + 5, postSpacing, 4);
      ctx.fillRect(x - postWidth / 2, baseY - TRACK_CONFIG.fenceHeight / 2, postSpacing, 4);
    }
  };

  drawFenceRow(metrics.top);
  drawFenceRow(metrics.bottom);
}

function drawForegroundFence(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const fenceY = height - TRACK_CONFIG.foregroundFenceHeight - 20;
  const postWidth = 14;
  const postSpacing = 50;
  const offset = (scrollOffset * 2) % postSpacing;

  for (let x = -offset; x < width + postSpacing; x += postSpacing) {
    ctx.fillStyle = "#3d2817";
    ctx.fillRect(x - postWidth / 2, fenceY, postWidth, TRACK_CONFIG.foregroundFenceHeight);

    ctx.fillStyle = "#4a3428";
    ctx.fillRect(x - postWidth / 2, fenceY + 10, postSpacing, 8);
    ctx.fillRect(x - postWidth / 2, fenceY + 30, postSpacing, 8);
  }
}

function drawFinishLine(ctx: CanvasRenderingContext2D, metrics: TrackMetrics, finishX: number) {
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 6]);
  ctx.beginPath();
  ctx.moveTo(finishX, metrics.top);
  ctx.lineTo(finishX, metrics.bottom);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px 'Press Start 2P', monospace";
  ctx.textAlign = "center";
  ctx.fillText("FINISH", finishX, metrics.top - 20);
  ctx.restore();
}

function render() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const maxCameraOffset = getMaxCameraOffset(width);

  const metrics = trackMetrics.value ?? computeTrackMetrics(height);
  trackMetrics.value = metrics;

  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height, metrics);
  drawTrack(ctx, width, metrics);
  drawFence(ctx, width, metrics);
  drawForegroundFence(ctx, width, height);

  if (finishLineVisible.value) {
    const finishScreenX = finishLineX.value - cameraOffset.value;
    const alignedX = Math.round(finishScreenX) + 0.5;
    const visibilityMargin = 400;
    if (alignedX > -visibilityMargin && alignedX < width + visibilityMargin) {
      drawFinishLine(ctx, metrics, alignedX);
    }
  }

  const shouldScroll =
    isParallaxActive.value &&
    !isPaused.value &&
    document.hasFocus() &&
    cameraOffset.value < maxCameraOffset - 0.5;

  if (shouldScroll) {
    scrollOffset += PARALLAX_SPEED;
  }

  animationFrameId = requestAnimationFrame(render);
}

const getHorseColor = (horseId: string): string => {
  const horse = horses.value.find((horseItem: IHorse) => horseItem.id === horseId);
  return horse?.color ?? "#ccc";
};

const getHorseStyle = (raceHorse: IRaceHorse) => {
  const metrics = trackMetrics.value;
  if (!metrics) {
    return { transform: "translate(-9999px, -9999px)" };
  }

  const horseIndex = raceHorses.value.findIndex(
    (item: IRaceHorse) => item.horseId === raceHorse.horseId,
  );
  if (horseIndex === -1) {
    return { transform: "translate(-9999px, -9999px)" };
  }

  const laneIndex = ((horseIndex % TRACK_CONFIG.lanes) + TRACK_CONFIG.lanes) % TRACK_CONFIG.lanes;
  const laneY = metrics.laneCenters[laneIndex] ?? metrics.top + TRACK_CONFIG.laneHeight / 2;
  const cappedPosition = Math.min(raceHorse.position, raceDistance.value);
  const worldX = TRACK_LAYOUT.startOffset + cappedPosition * trackScale.value;
  const screenX = worldX - cameraOffset.value;

  return {
    transform: `translate(${screenX}px, ${laneY - HORSE_VISUAL.height / 2}px)`,
  };
};

const togglePause = () => {
  if (isPaused.value) {
    store.dispatch("game/resumeRace");
  } else {
    store.dispatch("game/pauseRace");
  }
};

const clearFinalizeTimeout = () => {
  if (finalizeTimeoutId !== null) {
    clearTimeout(finalizeTimeoutId);
    finalizeTimeoutId = null;
  }
};

const startRaceUpdate = () => {
  if (raceUpdateInterval !== null) return;
  raceUpdateInterval = window.setInterval(updateHorsePositions, RACE_TICK_MS);
};

const stopRaceUpdate = () => {
  if (raceUpdateInterval !== null) {
    clearInterval(raceUpdateInterval);
    raceUpdateInterval = null;
  }
};

const scheduleRaceFinalization = (horsesSnapshot: IRaceHorse[]) => {
  if (hasRaceFinalized.value || finalizeTimeoutId !== null) return;
  const snapshot = horsesSnapshot.map((horse: IRaceHorse) => ({ ...horse }));

  finalizeTimeoutId = window.setTimeout(() => {
    void finalizeRace(snapshot);
  }, FINALIZE_DELAY_MS);
};

const updateHorsePositions = () => {
  if (
    !raceState.value.isRaceActive ||
    isPaused.value ||
    !isCountdownComplete.value ||
    raceHorses.value.length === 0
  ) {
    return;
  }

  const trackSurface = (track.value?.surface as TSurface) || "turf";
  let detectedFinishThisTick = false;

  const updatedHorses = raceHorses.value.map((raceHorse: IRaceHorse) => {
    const horse = horses.value.find((h) => h.id === raceHorse.horseId);
    if (!horse) return raceHorse;

    const baseSpeed = raceHorse.speed;
    const affinity = horse.surfaceAffinity[trackSurface] ?? 1;
    const conditionFactor = horse.currentCondition / 100;

    if (!raceHorse.isFinished) {
      const randomDrift = (Math.random() - 0.5) * 0.06;
      const affinityAdjustment = (affinity - 1) * 0.2;
      const conditionAdjustment = (conditionFactor - 0.5) * 0.25;
      const targetSpeed = clamp(
        baseSpeed * (1 + randomDrift + affinityAdjustment + conditionAdjustment),
        baseSpeed * 0.75,
        baseSpeed * 1.35,
      );
      const smoothing = 0.25;
      const newCurrentSpeed =
        raceHorse.currentSpeed + (targetSpeed - raceHorse.currentSpeed) * smoothing;

      let newPosition = raceHorse.position + newCurrentSpeed;
      if (newPosition >= raceDistance.value) {
        detectedFinishThisTick = true;
        const officialFinishTime = raceHorse.finishTime ?? Date.now();
        return {
          ...raceHorse,
          position: raceDistance.value,
          currentSpeed: newCurrentSpeed,
          isFinished: true,
          finishTime: officialFinishTime,
        };
      }

      return {
        ...raceHorse,
        position: Math.min(newPosition, raceDistance.value),
        currentSpeed: newCurrentSpeed,
      };
    }

    return {
      ...raceHorse,
      position: Math.min(raceHorse.position, raceDistance.value),
      currentSpeed: 0,
      isFinished: true,
      finishTime: raceHorse.finishTime,
    };
  });

  if (!finishSequenceStarted.value && detectedFinishThisTick) {
    finishSequenceStarted.value = true;
  }

  updateCameraOffset(updatedHorses);

  const officialPositions = updatedHorses.map((horse: IRaceHorse) =>
    Math.min(horse.position, raceDistance.value),
  );
  const officialMaxPosition = officialPositions.length > 0 ? Math.max(...officialPositions) : 0;
  const progress = clamp((officialMaxPosition / raceDistance.value) * 100, 0, 100);
  raceProgress.value = Number.isFinite(progress) ? progress : 0;

  store.dispatch("game/updateHorsePositions", updatedHorses);

  const allOfficialFinished = updatedHorses.every((horse: IRaceHorse) => horse.isFinished);
  if (allOfficialFinished) {
    scheduleRaceFinalization(updatedHorses);
  }
};

async function finalizeRace(horsesSnapshot: IRaceHorse[]) {
  if (hasRaceFinalized.value) return;
  hasRaceFinalized.value = true;
  clearFinalizeTimeout();

  const results = [...horsesSnapshot]
    .sort((a: IRaceHorse, b: IRaceHorse) => {
      if (a.finishTime && b.finishTime) {
        return a.finishTime - b.finishTime;
      }
      if (a.finishTime) return -1;
      if (b.finishTime) return 1;
      return b.position - a.position;
    })
    .map((horse: IRaceHorse) => horse.horseId);

  await store.dispatch("game/finishRace", results);
  router.push({ name: "race-management" });
}

function handleCountdownComplete() {
  isCountdownComplete.value = true;
  if (raceState.value.isRaceActive) {
    startRaceUpdate();
    if (!isPaused.value && !finishSequenceStarted.value) {
      isParallaxActive.value = true;
    }
  }
}

function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.width = window.innerWidth;
  const minHeight = TRACK_CONFIG.lanes * TRACK_CONFIG.laneHeight + 320;
  canvas.height = Math.max(window.innerHeight, minHeight);

  updateTrackMetrics();
}

watch(
  () => raceState.value.isRaceActive,
  (isActive) => {
    if (isActive) {
      raceProgress.value = 0;
      finishSequenceStarted.value = false;
      hasRaceFinalized.value = false;
      scrollOffset = 0;
      cameraOffset.value = 0;
      clearFinalizeTimeout();
      if (isCountdownComplete.value && !isPaused.value) {
        isParallaxActive.value = true;
      }
      startRaceUpdate();
      updateTrackMetrics();
    } else {
      stopRaceUpdate();
      isParallaxActive.value = false;
      cameraOffset.value = 0;
      clearFinalizeTimeout();
    }
  },
  { immediate: true },
);

watch(
  () => isPaused.value,
  (paused) => {
    if (paused) {
      stopRaceUpdate();
      isParallaxActive.value = false;
    } else if (raceState.value.isRaceActive) {
      startRaceUpdate();
      if (isCountdownComplete.value && !finishSequenceStarted.value) {
        isParallaxActive.value = true;
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  render();
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  stopRaceUpdate();
  clearFinalizeTimeout();
  scrollOffset = 0;
  cameraOffset.value = 0;
});
</script>

<template>
  <div class="race-track">
    <canvas ref="canvasRef" class="race-canvas"></canvas>

    <div
      class="race-controls"
      v-if="raceState.isRaceActive && isCountdownComplete && !finishSequenceStarted"
    >
      <button @click="togglePause" class="pause-btn">
        {{ isPaused ? "Resume" : "Pause" }}
      </button>
    </div>

    <div v-if="raceState.isRaceActive" class="race-hud">
      <div class="hud-info">
        <div class="hud-round">Round {{ currentRound || "-" }}</div>
        <div class="hud-track">{{ trackLabel }}</div>
        <div class="hud-distance">{{ raceDistance }}m</div>
      </div>

      <div v-if="isCountdownComplete" class="hud-progress">
        <div class="hud-progress-bar">
          <div class="hud-progress-fill" :style="{ width: `${raceProgress}%` }"></div>
          <div class="hud-progress-indicator" :style="{ left: `${raceProgress}%` }"></div>
        </div>
        <div class="hud-progress-flag">🏁</div>
      </div>

      <div v-if="isCountdownComplete" class="hud-standings">
        <div
          v-for="standing in liveStandingsTop"
          :key="standing.horseId"
          class="standing-chip"
          :class="{ 'standing-chip--podium': standing.position <= 3 }"
        >
          <span class="standing-position">{{ standing.position }}</span>
          <span class="standing-color" :style="{ backgroundColor: standing.color }"></span>
          <span class="standing-name">{{ standing.name }}</span>
          <span class="standing-id">{{ standing.horseId }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="raceState.isRaceActive"
      ref="horsesContainerRef"
      class="horses-container"
      :class="{ 'horses-container--paused': isPaused }"
    >
      <div
        v-for="raceHorse in raceHorses"
        :key="raceHorse.horseId"
        class="horse-element"
        :style="getHorseStyle(raceHorse)"
      >
        <div class="horse-square" :style="{ backgroundColor: getHorseColor(raceHorse.horseId) }">
          <span class="horse-id-label">{{ raceHorse.horseId }}</span>
        </div>
      </div>
    </div>

    <Countdown v-if="!isCountdownComplete" @complete="handleCountdownComplete" />
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
  @include pixelated;
}

.race-controls {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  z-index: 30;

  .pause-btn {
    padding: $spacing-sm $spacing-md;
    background: $primary;
    color: $white;
    border: 2px solid $black;
    border-radius: $radius-sm;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    @include retro-shadow($black-60);

    &:hover {
      background: $primary-dark;
      transform: translate(2px, 2px);
    }
  }
}

.race-hud {
  position: absolute;
  top: $spacing-lg;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  background: rgba(0, 0, 0, 0.78);
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-lg;
  border: 2px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: $spacing-md;
  min-width: 40vw;
  max-width: calc(100% - 2 * $spacing-md);
  pointer-events: none;

  @include mobile {
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-sm;
    padding: $spacing-md;
    min-width: unset;
    width: calc(100% - 2 * $spacing-md);
  }
}

.hud-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 140px;

  @include mobile {
    align-items: center;
    text-align: center;
  }
}

.hud-round {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $white;
}

.hud-track {
  font-size: $font-size-sm;
  text-transform: capitalize;
  color: var(--color-text-secondary);
}

.hud-distance {
  font-size: $font-size-base;
  color: $gold;
}

.hud-progress {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex: 1;
  min-width: 220px;
}

.hud-progress-bar {
  position: relative;
  flex: 1;
  height: 12px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  overflow: hidden;
}

.hud-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary 0%, $success 100%);
  transition: width 0.1s linear;
}

.hud-progress-indicator {
  position: absolute;
  top: -3px;
  width: 18px;
  height: 18px;
  background: $error;
  border: 2px solid $white;
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.1s linear;
}

.hud-progress-flag {
  font-size: 20px;
  animation: wave 1s ease-in-out infinite;
}

.hud-standings {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  max-width: 40vw;
  overflow: hidden;
  flex: 1;

  @include mobile {
    max-width: unset;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.standing-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-full;
  min-height: 28px;
  white-space: nowrap;
  transition: transform $transition-base;
}

.standing-chip--podium {
  border-color: var(--color-primary);
  transform: scale(1.04);
}

.standing-position {
  width: 20px;
  height: 20px;
  border-radius: $radius-sm;
  background: var(--color-background-light);
  color: var(--color-text-primary);
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  @include flex-center;
}

.standing-color {
  width: 14px;
  height: 14px;
  border-radius: $radius-sm;
  border: 1px solid var(--color-border);
}

.standing-name {
  font-size: $font-size-sm;
  color: var(--color-text-primary);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.standing-id {
  font-family: monospace;
  font-size: $font-size-xs;
  color: var(--color-text-secondary);
}

.horses-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.horses-container--paused .horse-element {
  transition: none;
}

.horse-element {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transform: translate(-9999px, -9999px);
  transition: transform 0.12s linear;
  will-change: transform;
}

.horse-square {
  width: 40px;
  height: 40px;
  border: 2px solid $white;
  border-radius: $radius-sm;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $black;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

.horse-id-label {
  font-family: monospace;
  font-size: $font-size-sm;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}
</style>
