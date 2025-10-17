<script setup lang="ts">
import { computed } from "vue";
import type { HudRenderData } from "../utils/RacePageRenderer";
import { ROUND_TEXT } from "../constants/race-texts";

interface Props {
  hudData: HudRenderData;
}

const props = defineProps<Props>();

const hudInfo = computed(() => props.hudData.hudInfo);
const progressBar = computed(() => props.hudData.progressBar);
const standings = computed(() => props.hudData.standings);
</script>

<template>
  <div v-if="hudData.isVisible" class="race-hud">
    <div class="hud-main">
      <div class="hud-info">
        <div class="hud-round">{{ ROUND_TEXT }} {{ hudInfo.round }}</div>
        <div class="hud-track">{{ hudInfo.trackLabel }}</div>
        <div class="hud-distance">{{ hudInfo.distance }}m</div>
      </div>
    </div>
    <div class="hud-progress-container">
      <div v-if="progressBar.isVisible" class="hud-progress">
        <div class="hud-progress-bar">
          <div class="hud-progress-fill" :style="{ width: `${progressBar.progress}%` }"></div>
        </div>
      </div>
      <div v-if="hudData.isCountdownComplete" class="hud-standings">
        <div
          v-for="standing in standings"
          :key="standing.horseId"
          class="standing-chip"
          :class="{ 'standing-chip--podium': standing.isPodium }"
        >
          <span class="standing-position">{{ standing.position }}</span>
          <span class="standing-color" :style="{ backgroundColor: standing.color }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.race-hud {
  position: absolute;
  top: $spacing-lg;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  background: rgba(0, 0, 0, 0.78);
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  border: 2px solid var(--color-primary);
  display: flex;
  gap: $spacing-sm;
  min-width: 400px;
  max-width: calc(100% - 2 * $spacing-md);
  pointer-events: none;
}

.hud-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
}
.hud-progress-container {
  flex-direction: column;
  display: flex;
}

.hud-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
}

.hud-round {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $white;
}

.hud-track {
  font-size: $font-size-sm;
  text-transform: capitalize;
  color: var(--color-text-secondary);
}

.hud-distance {
  font-size: $font-size-sm;
  color: $gold;
}

.hud-progress {
  display: flex;

  gap: $spacing-sm;
  flex: 1;
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

.hud-standings {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
}

.standing-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-sm;
  min-height: 20px;
  white-space: nowrap;
  transition: transform $transition-base;
  flex-shrink: 0;
}

.standing-chip--podium {
  border-color: var(--color-primary);
  transform: scale(1.04);
}

.standing-position {
  width: 16px;
  height: 16px;
  border-radius: $radius-sm;
  background: var(--color-background-light);
  color: var(--color-text-primary);
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  display: grid;
  place-items: center;
}

.standing-color {
  width: 12px;
  height: 12px;
  border-radius: $radius-sm;
  border: 1px solid var(--color-border);
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}
</style>
