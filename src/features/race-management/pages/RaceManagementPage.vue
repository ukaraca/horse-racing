<script setup lang="ts">
import { onMounted } from "vue";

import { Button, PlayIcon, TrophyIcon } from "@/shared/components/ui";
import { useStore } from "@/shared/composables";

import { FinalResultsModal, HorseCard, RaceResultsModal, RaceSchedule } from "../components";
import { useRaceManagement } from "../composables/useRaceManagement";
import {
  AVAILABLE_HORSES_TEXT,
  FINAL_RESULTS_TEXT,
  HORSES_COUNT_TEXT,
  NEXT_RACE_TEXT,
  PAGE_TITLE,
  RACE_SCHEDULE_TEXT,
  START_RACE_TEXT,
} from "../constants/race-management-texts";

const { dispatchAction, GAME_ACTIONS } = useStore();

const {
  horses,
  grandFinalResults,
  showResultsModal,
  showFinalResultsModal,
  selectedRoundResults,
  selectedRoundNumber,
  hasStartedRaces,
  allRoundsCompleted,
  nextRoundId,
  handleGenerateSchedule,
  handleStartRace,
  handleShowResults,
  handleShowFinalResults,
} = useRaceManagement();

onMounted(async () => {
  if (!horses.value.length) {
    await dispatchAction(GAME_ACTIONS.GENERATE_HORSES);
  }

  if (nextRoundId.value === 1) {
    handleGenerateSchedule();
  }
});
</script>

<template>
  <div class="race-management-page">
    <div class="race-header">
      <h1 class="page-title">{{ PAGE_TITLE }}</h1>
      <div class="race-header-buttons">
        <Button
          v-if="allRoundsCompleted"
          size="md"
          @click="handleShowFinalResults"
          class="final-results-btn"
        >
          <TrophyIcon class="icon" />
          {{ FINAL_RESULTS_TEXT }}
        </Button>
        <Button v-else-if="nextRoundId" size="md" @click="handleStartRace">
          <PlayIcon class="icon" />
          {{ hasStartedRaces ? `${NEXT_RACE_TEXT} (Round ${nextRoundId})` : START_RACE_TEXT }}
        </Button>
      </div>
    </div>

    <div class="race-management-layout">
      <div class="horses-section">
        <div class="section-header">
          <h2>
            {{ AVAILABLE_HORSES_TEXT }}
            <span class="count">{{ horses.length }} {{ HORSES_COUNT_TEXT }}</span>
          </h2>
        </div>

        <div class="horses-list">
          <HorseCard v-for="horse in horses" :key="horse.id" :horse="horse" />
        </div>
      </div>

      <div class="schedule-section">
        <div class="section-header">
          <h2>{{ RACE_SCHEDULE_TEXT }}</h2>
        </div>

        <RaceSchedule @show-results="handleShowResults" />
      </div>
    </div>

    <RaceResultsModal
      v-model="showResultsModal"
      :results="selectedRoundResults"
      :round-number="selectedRoundNumber"
    />

    <FinalResultsModal v-model="showFinalResultsModal" :results="grandFinalResults" />
  </div>
</template>

<style scoped lang="scss">
.race-management-page {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: $spacing-xl;
  background-color: var(--color-background);
}

.race-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-shrink: 0;
  height: auto;

  .page-title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: var(--color-text-primary);
    margin: 0;
    @include pixel-text-shadow($black, rgba(0, 0, 0, 0.5), $shadow-offset-lg, $shadow-offset-xl);
  }
}

.race-header-buttons {
  display: flex;
  gap: $spacing-md;
  align-items: center;

  :deep(.base-button--lg) {
    font-size: $font-size-xl;
    padding: $spacing-md $spacing-xl;
    height: auto;
    display: flex;
    align-items: center;
  }

  .final-results-btn {
    background: linear-gradient(135deg, var(--color-gold) 0%, #ffed4a 100%);
    color: var(--color-black);
    border-color: var(--color-gold);
    font-weight: $font-weight-bold;

    &:hover {
      background: linear-gradient(135deg, #ffed4a 0%, var(--color-gold) 100%);
      transform: translateY(-2px);
    }
  }

  .icon {
    margin-right: $spacing-xs;
  }
}

.race-management-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  @include mobile {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 2px solid var(--color-border);
  flex-shrink: 0;

  h2 {
    margin: 0;
    color: var(--color-primary);
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    width: 100%;
    @include flex-between;
  }

  .count {
    color: var(--color-text-secondary);
  }
}

.horses-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;

  .horses-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    padding-right: $spacing-xs;

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
}

.schedule-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}
</style>
