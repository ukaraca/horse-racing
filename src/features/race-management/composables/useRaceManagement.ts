import { computed, ref, watch } from "vue";

import { useNavigation, useStore } from "@/shared/composables";
import type { IGrandFinalResults, IHorse, IRound } from "@/shared/types";

export function useRaceManagement() {
  const { getGetter, dispatchAction, GAME_GETTERS, GAME_ACTIONS } = useStore();
  const { navigateTo, ROUTE_NAMES } = useNavigation();

  const horses = computed<IHorse[]>(() => getGetter(GAME_GETTERS.HORSES));
  const rounds = computed<IRound[]>(() => getGetter(GAME_GETTERS.ROUNDS));
  const lastFinishedRoundId = computed<number | null>(() =>
    getGetter(GAME_GETTERS.LAST_FINISHED_ROUND_ID),
  );
  const grandFinalResults = computed<IGrandFinalResults[]>(() =>
    getGetter(GAME_GETTERS.GRAND_FINAL_RESULTS),
  );

  const showResultsModal = ref(false);
  const showFinalResultsModal = ref(false);
  const selectedRoundResults = ref<string[]>([]);
  const selectedRoundNumber = ref(0);

  const hasStartedRaces = computed<boolean>(() => {
    return rounds.value.some((round) => round.result);
  });

  const allRoundsCompleted = computed<boolean>(() => {
    return rounds.value.length === 6 && rounds.value.every((round: IRound) => round.result);
  });

  const nextRoundId = computed<number | null>(() => {
    if (allRoundsCompleted.value) {
      return null;
    }
    const lastCompletedIndex = rounds.value.findIndex((round: IRound) => !round.result);
    const nextRound = lastCompletedIndex !== -1 ? rounds.value[lastCompletedIndex] : null;
    return nextRound?.id || 1;
  });

  const handleGenerateSchedule = () => {
    dispatchAction(GAME_ACTIONS.GENERATE_RACE_SCHEDULE);
  };

  const handleStartRace = async () => {
    if (nextRoundId.value) {
      await dispatchAction(GAME_ACTIONS.START_RACE, nextRoundId.value);
      navigateTo(ROUTE_NAMES.RACE);
    }
  };

  const handleShowResults = (roundId: number) => {
    const round = rounds.value.find((r) => r.id === roundId);
    if (round?.result) {
      selectedRoundResults.value = round.result;
      selectedRoundNumber.value = roundId;
      showResultsModal.value = true;
    }
  };

  const handleShowFinalResults = async () => {
    if (grandFinalResults.value.length === 0) {
      await dispatchAction(GAME_ACTIONS.CALCULATE_GRAND_FINAL_RESULTS);
    }
    showFinalResultsModal.value = true;
  };

  watch(showResultsModal, (isVisible: boolean) => {
    if (!isVisible) {
      dispatchAction(GAME_ACTIONS.CLEAR_LAST_FINISHED_ROUND);
    }
  });

  watch(
    lastFinishedRoundId,
    (newRoundId: number | null) => {
      if (newRoundId !== null) {
        const round = rounds.value.find((r) => r.id === newRoundId);
        if (round?.result) {
          selectedRoundResults.value = round.result;
          selectedRoundNumber.value = newRoundId;
          showResultsModal.value = true;
        }
      }
    },
    { immediate: true },
  );

  return {
    horses,
    rounds,
    lastFinishedRoundId,
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
  };
}
