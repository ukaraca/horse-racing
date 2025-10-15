<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HorseCard from "./components/HorseCard.vue";
import RaceSchedule from "./components/RaceSchedule.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import RaceResultsModal from "@/features/race/components/RaceResultsModal.vue";
import type { IRound } from "@/utils/types";

const store = useStore();
const router = useRouter();
const horses = computed(() => store.getters["game/horses"]);
const rounds = computed(() => store.getters["game/rounds"] as IRound[]);
// const currentRound = computed(() => store.getters["game/currentRound"]); // Removed unused variable

// Modal state
const showResultsModal = ref(false);
const selectedRoundResults = ref<string[]>([]);
const selectedRoundNumber = ref(0);

const handleGenerateSchedule = () => {
  store.dispatch("game/generateRaceSchedule");
};

// Check if any races have started to determine button text
const hasStartedRaces = computed(() => {
  return rounds.value.some((round: IRound) => round.result);
});

// Find next race to start
const nextRoundId = computed(() => {
  const lastCompletedIndex = rounds.value.findIndex((round: IRound) => !round.result);
  const nextRound = lastCompletedIndex !== -1 ? rounds.value[lastCompletedIndex] : null;
  return nextRound?.id || 1;
});

const handleStartRace = async () => {
  // Start the next race
  await store.dispatch("game/startRace", nextRoundId.value);
  // Go to race page
  router.push({ name: "race" });
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
};

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
      <BaseButton size="lg" @click="handleStartRace">
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
      </BaseButton>
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

  // Start Race button alignment
  :deep(.base-button--lg) {
    font-size: $font-size-xl;
    padding: $spacing-md $spacing-xl;
    height: auto;
    display: flex;
    align-items: center;
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
