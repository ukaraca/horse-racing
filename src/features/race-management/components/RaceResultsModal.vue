<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

import Button from "@/shared/components/ui/Button.vue";
import Modal from "@/shared/components/ui/Modal.vue";
import type { IHorse } from "@/shared/types";
import { getMedalEmoji, getPositionColor, getPositionSuffix } from "@/shared/utils";

import { CLOSE_TEXT, ROUND_RESULTS_TITLE } from "../constants/race-management-texts";

interface Props {
  modelValue: boolean;
  results: string[];
  roundNumber: number;
}

const { modelValue, results, roundNumber } = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { getters } = useStore();
const horses = computed(() => getters["game/horses"] as IHorse[]);

const getHorseById = (horseId: string): IHorse => {
  return horses.value.find((h) => h.id === horseId)!;
};

const handleClose = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="ROUND_RESULTS_TITLE.replace('{roundNumber}', roundNumber.toString())"
  >
    <div class="race-results-content">
      <div class="results-list">
        <div
          v-for="(horseId, index) in results"
          :key="horseId"
          class="result-item"
          :class="{ podium: index < 3 }"
        >
          <div class="position">
            <span class="position-number" :style="{ color: getPositionColor(index + 1) }">
              {{ index + 1 }}
            </span>
            <span class="position-suffix">{{ getPositionSuffix(index + 1) }}</span>
          </div>

          <div
            class="horse-color-indicator"
            :style="{ backgroundColor: getHorseById(horseId).color }"
          ></div>

          <div class="horse-info">
            <div class="horse-name">{{ getHorseById(horseId).name }}</div>
            <div class="horse-id">{{ horseId }}</div>
          </div>

          <div v-if="index < 3" class="medal" :class="`medal-${horseId}`">
            {{ getMedalEmoji(index + 1) }}
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <Button size="lg" @click="handleClose">{{ CLOSE_TEXT }}</Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.race-results-content {
  @include flex-column;
  gap: $spacing-lg;
}

.results-list {
  @include flex-column;
  gap: $spacing-sm;
}

.result-item {
  @include flex-center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: var(--color-background-light);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease;

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-primary);
  }

  &.podium {
    border: 2px solid var(--color-primary);
    background: linear-gradient(
      135deg,
      var(--color-background-light) 0%,
      var(--color-primary-light) 100%
    );
  }
}

.position {
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 50px;
}

.position-number {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
}

.position-suffix {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);
  font-weight: $font-weight-normal;
}

.horse-color-indicator {
  width: 32px;
  height: 32px;
  border-radius: $radius-sm;
  border: 2px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.horse-info {
  flex: 1;
  @include flex-column;
  gap: $spacing-xs;
}

.horse-name {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: var(--color-text-primary);
}

.horse-id {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);
  font-family: monospace;
}

.medal {
  font-size: $font-size-2xl;
  @include bounce;
}

.modal-actions {
  @include flex-center;
}
</style>
