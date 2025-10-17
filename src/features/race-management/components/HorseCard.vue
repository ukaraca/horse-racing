<script setup lang="ts">
import { computed } from "vue";

import Card from "@/shared/components/ui/Card.vue";
import type { IHorse } from "@/shared/types";

interface Props {
  horse: IHorse;
}

const { horse } = defineProps<Props>();

const conditionPercentage = computed(() => {
  return `${horse.currentCondition}%`;
});

const conditionColor = computed(() => {
  const CONDITION_SUCCESS_THRESHOLD = 70;
  const CONDITION_WARNING_THRESHOLD = 40;

  if (horse.currentCondition >= CONDITION_SUCCESS_THRESHOLD) return "var(--color-success)";
  if (horse.currentCondition >= CONDITION_WARNING_THRESHOLD) return "var(--color-warning)";
  return "var(--color-error)";
});
</script>

<template>
  <Card hoverable padding="sm" class="horse-card">
    <div class="horse-content">
      <div class="horse-header">
        <div class="color-indicator" :style="{ backgroundColor: horse.color }"></div>
      </div>
      <div class="horse-name">{{ horse.name }}</div>
    </div>
    <div class="condition-section">
      <div class="condition-value">{{ horse.currentCondition.toFixed(0) }}/100</div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width: conditionPercentage,
            backgroundColor: conditionColor,
          }"
        ></div>
      </div>
    </div>
  </Card>
</template>

<style scoped lang="scss">
.horse-card {
  @include flex-between;
  gap: $spacing-sm;
  min-height: auto;
  padding: $spacing-xs;
  transition: all $transition-base;
  @include pixel-border($border, 3px);

  .horse-content {
    @include flex-between;
    gap: $spacing-xs;
  }

  &:hover {
    border-color: $primary;
    transform: translate(-2px, -2px);
    box-shadow:
      4px 4px 0 $black-30,
      2px 2px 0 $primary;
  }

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;
  }
}

.horse-header {
  @include flex-center;
  gap: $spacing-xs;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid $surface-lighter;
  box-shadow: $shadow-sm;
  transition: transform $transition-fast;

  .horse-card:hover & {
    transform: scale(1.1);
    border-color: white;
  }
}

.horse-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0;
  flex: 1;
  min-width: 0;
  @include text-truncate;
}

.condition-section {
  margin-top: 0;
  min-width: 120px;
  @include flex-between;
  gap: 4px;
}

.condition-value {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  text-align: right;
  line-height: 1;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: $surface-light;
  border-radius: $radius-full;
  overflow: hidden;
  box-shadow: inset 0 1px 3px $black-30;
}

.progress-fill {
  height: 100%;
  border-radius: $radius-full;
  transition:
    width $transition-base,
    background-color $transition-base;
  box-shadow: 0 0 8px currentColor;
}
</style>
