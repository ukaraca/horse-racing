<script setup lang="ts">
import { computed } from "vue";

import { Modal } from "@/shared/components/ui";
import { useStore } from "@/shared/composables";
import type { IGrandFinalResults, IHorse } from "@/shared/types";
import { getMedalEmoji, getPositionColor, getPositionSuffix } from "@/shared/utils";

import {
  AFTER_6_ROUNDS_TEXT,
  GRAND_FINAL_RESULTS_TITLE,
  SCORING_TEXT,
  TOTAL_POINTS_TEXT,
} from "../constants/race-management-texts";

interface Props {
  modelValue: boolean;
  results: IGrandFinalResults[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { getGetter, GAME_GETTERS } = useStore();
const horses = computed(() => getGetter<IHorse[]>(GAME_GETTERS.HORSES));

const getHorseById = (horseId: string): IHorse => {
  return horses.value.find((h) => h.id === horseId)!;
};
</script>

<template>
  <Modal
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="GRAND_FINAL_RESULTS_TITLE"
  >
    <div class="final-results-content">
      <div class="championship-info">
        <p>
          {{ AFTER_6_ROUNDS_TEXT }}
        </p>
        <div class="scoring-info">
          <small>{{ SCORING_TEXT }}</small>
        </div>
      </div>

      <div class="results-list">
        <div
          v-for="result in props.results"
          :key="result.horseId"
          class="result-item final-result-item"
          :class="{ podium: result.finalPosition <= 3, champion: result.finalPosition === 1 }"
        >
          <div class="position">
            <span
              class="position-number"
              :style="{ color: getPositionColor(result.finalPosition) }"
            >
              {{ result.finalPosition }}
            </span>
            <span class="position-suffix">{{ getPositionSuffix(result.finalPosition) }}</span>
          </div>

          <div
            class="horse-color-indicator"
            :style="{ backgroundColor: getHorseById(result.horseId).color }"
          ></div>

          <div class="horse-info">
            <div class="horse-name">
              {{ getHorseById(result.horseId).name }}
            </div>
            <div class="horse-id">{{ result.horseId }}</div>
          </div>

          <div class="total-points">
            <span class="points-label">{{ TOTAL_POINTS_TEXT }}</span>
            <span class="points-value">{{ result.totalPoints }}</span>
          </div>

          <div
            v-if="result.finalPosition <= 3"
            class="medal"
            :class="`medal-${result.finalPosition}`"
          >
            {{ getMedalEmoji(result.finalPosition) }}
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.final-results-content {
  @include flex-column;
  gap: $spacing-lg;
}

.championship-info {
  text-align: center;
  padding: $spacing-md;
  background: var(--color-surface);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);

  p {
    margin: 0 0 $spacing-sm 0;
    color: var(--color-text-primary);
    font-weight: $font-weight-medium;
  }
}

.scoring-info {
  color: var(--color-text-secondary);
  font-size: $font-size-sm;
}

.results-list {
  @include flex-column;
  gap: $spacing-sm;
}

.final-result-item {
  @include flex-center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: $radius-md;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  &.podium {
    border-color: var(--color-gold);
    background: linear-gradient(135deg, var(--color-surface) 0%, rgba(255, 215, 0, 0.1) 100%);
  }

  &.champion {
    border-color: var(--color-gold);
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, var(--color-surface) 100%);
    box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);

    &::before {
      content: "👑";
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      font-size: $font-size-lg;
    }
  }
}

.position {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 60px;
}

.position-number {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
}

.position-suffix {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);
  text-transform: lowercase;
}

.horse-color-indicator {
  width: 24px;
  height: 24px;
  border-radius: $radius-sm;
  border: 2px solid var(--color-border);
  flex-shrink: 0;
}

.horse-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.horse-name {
  font-weight: $font-weight-semibold;
  color: var(--color-text-primary);
}

.horse-id {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);
  font-family: monospace;
}

.total-points {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 80px;
}

.points-label {
  font-size: $font-size-xs;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-weight: $font-weight-medium;
}

.points-value {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: var(--color-primary);
}

.medal {
  font-size: $font-size-xl;
  min-width: 32px;
  text-align: center;
}

.medal-1 {
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
