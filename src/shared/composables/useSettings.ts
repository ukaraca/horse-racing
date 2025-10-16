import { computed } from "vue";
import { useStore } from "@/shared/composables";

export function useSettings() {
  const { getGetter, dispatchAction, GAME_GETTERS, GAME_ACTIONS } = useStore();

  const settings = computed(() => getGetter(GAME_GETTERS.SETTINGS));
  const isMusicEnabled = computed(() => getGetter(GAME_GETTERS.IS_MUSIC_ENABLED));
  const isSoundEnabled = computed(() => getGetter(GAME_GETTERS.IS_SOUND_ENABLED));
  const isFullscreenEnabled = computed(() => getGetter(GAME_GETTERS.IS_FULLSCREEN_ENABLED));

  const toggleMusic = () => {
    dispatchAction(GAME_ACTIONS.TOGGLE_MUSIC);
  };

  const toggleSound = () => {
    dispatchAction(GAME_ACTIONS.TOGGLE_SOUND);
  };

  const toggleFullscreen = () => {
    dispatchAction(GAME_ACTIONS.TOGGLE_FULLSCREEN);
  };

  return {
    settings,
    isMusicEnabled,
    isSoundEnabled,
    isFullscreenEnabled,
    toggleMusic,
    toggleSound,
    toggleFullscreen,
  };
}
