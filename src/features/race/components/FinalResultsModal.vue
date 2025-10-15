<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import Button from "@/shared/components/ui/Button.vue";
import type { IHorse, IGrandFinalResults } from "@/shared/types";

interface Props {
  isVisible: boolean;
  results: IGrandFinalResults[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const store = useStore();
const horses = computed(() => store.getters["game/horses"] as IHorse[]);

const getHorseById = (horseId: string): IHorse | undefined => {
  return horses.value.find((h) => h.id === horseId);
};

const getPositionColor = (position: number): string => {
  switch (position) {
    case 1:
      return "var(--color-gold, #ffd700)";
    case 2:
      return "var(--color-silver, #c0c0c0)";
    case 3:
      return "var(--color-bronze, #cd7f32)";
    default:
      return "var(--color-text-secondary)";
  }
};

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleClose">
    <div class="modal-content final-results-modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">🏆 Grand Final Results</h2>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>

      <div class="final-results-content">
        <div class="championship-info">
          <p>
            After 6 rounds of intense racing, here are the final standings based on total points
            earned!
          </p>
          <div class="scoring-info">
            <small>Scoring: 1st place = 10 points, 2nd = 9 points, 3rd = 8 points, etc.</small>
          </div>
        </div>

        <div class="results-list">
          <div
            v-for="result in results"
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
              <span class="position-suffix">{{
                result.finalPosition === 1
                  ? "st"
                  : result.finalPosition === 2
                    ? "nd"
                    : result.finalPosition === 3
                      ? "rd"
                      : "th"
              }}</span>
            </div>

            <div
              class="horse-color-indicator"
              :style="{ backgroundColor: getHorseById(result.horseId)?.color || '#ccc' }"
            ></div>

            <div class="horse-info">
              <div class="horse-name">
                {{ getHorseById(result.horseId)?.name || "Unknown Horse" }}
              </div>
              <div class="horse-id">{{ result.horseId }}</div>
            </div>

            <div class="total-points">
              <span class="points-label">Total Points:</span>
              <span class="points-value">{{ result.totalPoints }}</span>
            </div>

            <div
              v-if="result.finalPosition <= 3"
              class="medal"
              :class="`medal-${result.finalPosition}`"
            >
              {{ result.finalPosition === 1 ? "🏆" : result.finalPosition === 2 ? "🥈" : "🥉" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.final-results-modal {
  background: var(--color-background);
  border: 3px solid var(--color-primary);
  border-radius: $radius-lg;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 2px solid var(--color-border);
  background: var(--color-primary);
}

.modal-title {
  margin: 0;
  color: var(--color-background);
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.close-btn {
  background: none;
  border: none;
  font-size: $font-size-2xl;
  cursor: pointer;
  color: var(--color-background);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.final-results-content {
  padding: $spacing-lg;
  max-height: 60vh;
  overflow-y: auto;
}

.championship-info {
  text-align: center;
  margin-bottom: $spacing-lg;
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
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.final-result-item {
  display: flex;
  align-items: center;
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

.modal-actions {
  display: flex;
  justify-content: center;
  padding: $spacing-lg;
  border-top: 2px solid var(--color-border);
  background: var(--color-surface);
}

// Custom scrollbar for results list
.results-list::-webkit-scrollbar {
  width: 8px;
}

.results-list::-webkit-scrollbar-track {
  background: var(--color-background-light);
  border-radius: 4px;
}

.results-list::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 4px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark);
}
</style>
