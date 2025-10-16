<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/shared/composables";
import Card from "@/shared/components/ui/Card.vue";
import type { IHorse } from "@/shared/types";
import {
  NO_SCHEDULE_TEXT,
  PARTICIPANTS_TEXT,
  ROUND_TEXT,
  RESULTS_TEXT,
  COMPLETED_TEXT,
  PENDING_TEXT,
} from "../constants/race-management-texts";

const { getGetter, GAME_GETTERS } = useStore();
const rounds = computed(() => getGetter(GAME_GETTERS.ROUNDS));
const horses = computed(() => getGetter(GAME_GETTERS.HORSES));

const getHorseById = (horseId: string): IHorse => {
  return horses.value.find((horse: IHorse) => horse.id === horseId)!;
};

const emit = defineEmits<{
  showResults: [roundId: number];
}>();
</script>

<template>
  <div class="race-schedule">
    <div v-if="rounds.length === 0" class="no-schedule">
      <p>{{ NO_SCHEDULE_TEXT }}</p>
    </div>

    <div v-else class="rounds-list">
      <Card v-for="round in rounds" :key="round.id" class="round-card" padding="sm">
        <div class="round-header">
          <div class="round-info">
            <h3>{{ ROUND_TEXT }} {{ round.id }}</h3>
            <div class="round-details">
              <span class="distance">{{ round.distance }}m</span>
              <span class="surface">{{ round.surface }}</span>
              <span class="condition">{{ round.track.condition }}</span>
            </div>
          </div>
          <div class="round-status">
            <span
              class="status-badge"
              :class="{ 'status-completed': round.result, 'status-pending': !round.result }"
            >
              {{ round.result ? COMPLETED_TEXT : PENDING_TEXT }}
            </span>
            <button v-if="round.result" @click="emit('showResults', round.id)" class="results-btn">
              {{ RESULTS_TEXT }}
            </button>
          </div>
        </div>

        <div class="participants">
          <h4>{{ PARTICIPANTS_TEXT }} ({{ round.participants.length }})</h4>
          <div class="horses-list">
            <div v-for="horseId in round.participants" :key="horseId" class="participant-horse">
              <div
                class="horse-color-indicator"
                :style="{
                  backgroundColor: getHorseById(horseId).color,
                }"
              ></div>
              <span class="horse-name">
                {{ getHorseById(horseId).name }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="round.result" class="results">
          <h4>{{ RESULTS_TEXT }}</h4>
          <div class="results-list">
            <div v-for="(horseId, index) in round.result" :key="horseId" class="result-item">
              <span class="position">{{ index + 1 }}.</span>
              <div
                class="horse-color-indicator"
                :style="{
                  backgroundColor: getHorseById(horseId).color,
                }"
              ></div>
              <span class="horse-name">
                {{ getHorseById(horseId).name }}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.race-schedule {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-schedule {
  @include flex-center;
  min-height: 200px;
  color: var(--color-text-secondary);
  text-align: center;
}

.rounds-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  min-height: 0;

  // Custom scrollbar
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-background-light);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary-dark);
  }
}

.round-card {
  border-left: 4px solid var(--color-primary);
}

.round-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-md;

  .round-info {
    h3 {
      margin: 0 0 $spacing-xs 0;
      color: var(--color-primary);
    }

    .round-details {
      display: flex;
      gap: $spacing-sm;
      font-size: $font-size-sm;
      color: var(--color-text-secondary);

      span {
        padding: 2px $spacing-xs;
        background-color: var(--color-background-light);
        border-radius: $radius-sm;
      }
    }
  }

  .round-status {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .status-badge {
      padding: 4px $spacing-sm;
      border-radius: $radius-sm;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;

      &.status-pending {
        background-color: var(--color-warning-light);
        color: var(--color-warning-dark);
      }

      &.status-completed {
        background-color: var(--color-success-light);
        color: var(--color-success-dark);
      }
    }

    .results-btn {
      padding: 4px $spacing-sm;
      background: var(--color-primary);
      color: $white;
      border: 1px solid var(--color-primary);
      border-radius: $radius-sm;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: all $transition-base;

      &:hover {
        background: var(--color-primary-dark);
        border-color: var(--color-primary-dark);
      }
    }
  }
}

.participants {
  // margin-bottom: $spacing-md;

  h4 {
    margin: 0 0 $spacing-sm 0;
    font-size: $font-size-base;
    color: var(--color-text-secondary);
  }

  .horses-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: $spacing-xs;
  }

  .participant-horse {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
  }
}

.results {
  border-top: 1px solid var(--color-border);
  padding-top: $spacing-md;

  h4 {
    margin: 0 0 $spacing-sm 0;
    font-size: $font-size-base;
    color: var(--color-success);
  }

  .results-list {
    .result-item {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      margin-bottom: $spacing-xs;
      font-size: $font-size-sm;

      .position {
        font-weight: $font-weight-semibold;
        min-width: 20px;
        color: var(--color-primary);
      }
    }
  }
}

.horse-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid var(--color-border);
}

.horse-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
