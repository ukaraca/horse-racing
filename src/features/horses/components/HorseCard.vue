<script setup lang="ts">
import { computed } from "vue";
import BaseCard from "@/components/base/BaseCard.vue";
import type { IHorse } from "@/utils/types";

interface Props {
  horse: IHorse;
  compact?: boolean;
}

const props = defineProps<Props>();

const conditionPercentage = computed(() => {
  return `${props.horse.currentCondition}%`;
});

const conditionColor = computed(() => {
  if (props.horse.currentCondition >= 70) return "var(--color-success)";
  if (props.horse.currentCondition >= 40) return "var(--color-warning)";
  return "var(--color-error)";
});
</script>

<template>
  <BaseCard hoverable :padding="compact ? 'xs' : 'md'" class="horse-card" :class="{ compact }">
    <template v-if="compact">
      <div class="horse-header compact-header">
        <!-- <div class="horse-id">{{ horse.id }}</div> -->
        <div class="color-indicator" :style="{ backgroundColor: horse.color }" />
      </div>
      <div class="horse-name">{{ horse.name }}</div>
      <div class="condition-section compact-condition">
        <div class="condition-value">{{ horse.currentCondition.toFixed(2) }}/100</div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: conditionPercentage,
              backgroundColor: conditionColor,
            }"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="horse-header">
        <div class="horse-id">{{ horse.id }}</div>
        <div class="color-indicator" :style="{ backgroundColor: horse.color }" />
      </div>

      <div class="horse-name">{{ horse.name }}</div>

      <div class="condition-section">
        <div class="condition-label">
          <span>Condition</span>
          <span class="condition-value">{{ horse.currentCondition }}/100</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: conditionPercentage,
              backgroundColor: conditionColor,
            }"
          />
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped lang="scss">
.horse-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-xs;
  min-height: 160px;
  transition: all $transition-base;
  @include pixel-border($border, 3px);

  &:hover {
    border-color: $primary;
    transform: translate(-2px, -2px);
    box-shadow:
      4px 4px 0 $black-30,
      2px 2px 0 $primary;
  }
}

.horse-header {
  @include flex-between;
  align-items: center;
}

// .horse-id {
//   font-size: $font-size-sm;
//   font-weight: $font-weight-bold;
//   color: $text-secondary;
//   background: $surface-light;
//   padding: $spacing-xs $spacing-sm;
//   border-radius: $radius-sm;
//   font-family: monospace;
// }

.color-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid $surface-lighter;
  box-shadow: $shadow-sm;
  transition: transform $transition-fast;

  .horse-card:hover & {
    transform: scale(1.1);
    border-color: white;
  }
}

.horse-name {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  // margin: $spacing-xs 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.condition-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-top: auto;
}

.condition-label {
  @include flex-between;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.condition-value {
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.progress-bar {
  width: 100%;
  height: 8px;
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

// Compact styles
.horse-card.compact {
  flex-direction: row;
  align-items: center;
  gap: $spacing-sm;
  min-height: auto;

  .compact-header {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    margin-bottom: 0;
    justify-content: flex-start !important;

    .horse-id {
      font-size: $font-size-xs;
      padding: 2px $spacing-xs;
    }

    .color-indicator {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }
  }

  .horse-name {
    font-size: $font-size-sm;
    margin: 0;
    flex: 1;
    min-width: 0;
  }

  .compact-condition {
    margin-top: 0;
    min-width: 120px;
    @include flex-between;
    gap: 4px;

    .condition-value {
      font-size: $font-size-xs;
      text-align: right;
    }

    .progress-bar {
      height: 6px;
    }
  }
}
</style>
