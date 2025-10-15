<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HorseCard from "./components/HorseCard.vue";
import RaceSchedule from "./components/RaceSchedule.vue";
import Button from "@/shared/components/ui/Button.vue";
import RaceResultsModal from "@/features/race/components/RaceResultsModal.vue";
import FinalResultsModal from "@/features/race/components/FinalResultsModal.vue";
import type { IRound, IGrandFinalResults } from "@/shared/types";

const store = useStore();
const router = useRouter();
const horses = computed(() => store.getters["game/horses"]);
const rounds = computed(() => store.getters["game/rounds"] as IRound[]);
const lastFinishedRoundId = computed(
  () => store.getters["game/lastFinishedRoundId"] as number | null,
);
const grandFinalResults = computed(
  () => store.getters["game/grandFinalResults"] as IGrandFinalResults[],
);

// Modal state
const showResultsModal = ref(false);
const showFinalResultsModal = ref(false);
const selectedRoundResults = ref<string[]>([]);
const selectedRoundNumber = ref(0);

const handleGenerateSchedule = () => {
  store.dispatch("game/generateRaceSchedule");
};

// Check if any races have started to determine button text
const hasStartedRaces = computed(() => {
  return rounds.value.some((round: IRound) => round.result);
});

// Check if all rounds are completed (6 rounds)
const allRoundsCompleted = computed(() => {
  return rounds.value.length === 6 && rounds.value.every((round: IRound) => round.result);
});

// Find next race to start - fix for bug where it goes back to round 1 after round 6
const nextRoundId = computed(() => {
  if (allRoundsCompleted.value) {
    return null; // No next round if all completed
  }
  const lastCompletedIndex = rounds.value.findIndex((round: IRound) => !round.result);
  const nextRound = lastCompletedIndex !== -1 ? rounds.value[lastCompletedIndex] : null;
  return nextRound?.id || 1;
});

const handleStartRace = async () => {
  if (nextRoundId.value) {
    // Start the next race
    await store.dispatch("game/startRace", nextRoundId.value);
    // Go to race page
    router.push({ name: "race" });
  }
};

const handleShowResults = (roundId: number) => {
  const round = rounds.value.find((r: IRound) => r.id === roundId);
  if (round?.result) {
    selectedRoundResults.value = round.result;
    selectedRoundNumber.value = roundId;
    showResultsModal.value = true;
  }
};

const handleCloseModal = () => {
  showResultsModal.value = false;
  // Clear the last finished round ID after closing modal
  store.dispatch("game/clearLastFinishedRound");
};

const handleCloseFinalResultsModal = () => {
  showFinalResultsModal.value = false;
};

const handleShowFinalResults = async () => {
  // Calculate grand final results if not already calculated
  if (grandFinalResults.value.length === 0) {
    await store.dispatch("game/calculateGrandFinalResults");
  }
  showFinalResultsModal.value = true;
};

// Auto-open modal when returning from race
watch(
  lastFinishedRoundId,
  (newRoundId) => {
    if (newRoundId !== null) {
      const round = rounds.value.find((r: IRound) => r.id === newRoundId);
      if (round?.result) {
        selectedRoundResults.value = round.result;
        selectedRoundNumber.value = newRoundId;
        showResultsModal.value = true;
      }
    }
  },
  { immediate: true },
);

// Route'a girince otomatik olarak hem atları hem race schedule'ı oluştur
onMounted(async () => {
  // Önce atları oluştur (eğer yoksa)
  if (horses.value.length === 0) {
    await store.dispatch("game/generateHorses");
  }

  // Sonra race schedule'ı oluştur (eğer yoksa)
  if (rounds.value.length === 0) {
    await handleGenerateSchedule();
  }
});
</script>

<template>
  <div class="race-management-page">
    <div class="race-header">
      <h1 class="page-title">Race Management</h1>
      <div class="race-header-buttons">
        <Button
          v-if="allRoundsCompleted"
          size="md"
          @click="handleShowFinalResults"
          class="final-results-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="margin-right: 8px"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          Final Results
        </Button>
        <Button v-else-if="nextRoundId" size="md" @click="handleStartRace">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="margin-right: 8px"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          {{ hasStartedRaces ? `Next Race (Round ${nextRoundId})` : "Start Race" }}
        </Button>
      </div>
    </div>

    <div class="race-management-layout">
      <div class="horses-section">
        <div class="section-header">
          <h2>
            Available Horses <span class="count">{{ horses.length }} horses</span>
          </h2>
        </div>

        <div class="horses-list">
          <HorseCard v-for="horse in horses" :key="horse.id" :horse="horse" :compact="true" />
        </div>
      </div>

      <div class="schedule-section">
        <div class="section-header">
          <h2>Race Schedule</h2>
        </div>

        <RaceSchedule @show-results="handleShowResults" />
      </div>
    </div>

    <!-- Results Modal -->
    <RaceResultsModal
      :is-visible="showResultsModal"
      :results="selectedRoundResults"
      :round-number="selectedRoundNumber"
      @close="handleCloseModal"
    />

    <!-- Final Results Modal -->
    <FinalResultsModal
      :is-visible="showFinalResultsModal"
      :results="grandFinalResults"
      @close="handleCloseFinalResultsModal"
    />
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

  // Button styling
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
}

.race-management-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl;
  flex: 1;
  min-height: 0; // Important for flexbox children to shrink
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
}

.schedule-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}
</style>
