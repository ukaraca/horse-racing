<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import BaseButton from "@/components/base/BaseButton.vue";
import type { IHorse } from "@/utils/types";

interface Props {
  isVisible: boolean;
  results: string[];
  roundNumber: number;
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
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Round {{ roundNumber }} Results</h2>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>

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
            <span class="position-suffix">{{
              index + 1 === 1 ? "st" : index + 1 === 2 ? "nd" : index + 1 === 3 ? "rd" : "th"
            }}</span>
          </div>

          <div
            class="horse-color-indicator"
            :style="{ backgroundColor: getHorseById(horseId)?.color || '#ccc' }"
          ></div>

          <div class="horse-info">
            <div class="horse-name">{{ getHorseById(horseId)?.name || "Unknown Horse" }}</div>
            <div class="horse-id">{{ horseId }}</div>
          </div>

          <div v-if="index < 3" class="medal" :class="`medal-${index + 1}`">
            {{ index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉" }}
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <BaseButton size="lg" @click="handleClose"> Close </BaseButton>
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
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: var(--color-background, #1a1a2e);
  border: 3px solid var(--color-primary);
  border-radius: $radius-lg;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
  @include retro-shadow-multi(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3), 4px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 2px solid var(--color-border);
}

.modal-title {
  margin: 0;
  color: var(--color-primary);
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: var(--color-background-light);
    color: var(--color-text-primary);
  }
}

.results-list {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.result-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: var(--color-background-light);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease;

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
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  font-size: 24px;
  animation: bounce 0.6s ease-out;
}

.modal-actions {
  padding: $spacing-lg;
  border-top: 2px solid var(--color-border);
  display: flex;
  justify-content: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>
