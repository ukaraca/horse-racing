import { computed } from "vue";
import { useStore } from "vuex";

export function useSettings() {
  const store = useStore();

  const settings = computed(() => store.getters["game/settings"]);
  const isMusicEnabled = computed(() => store.getters["game/isMusicEnabled"]);
  const isSoundEnabled = computed(() => store.getters["game/isSoundEnabled"]);
  const isFullscreenEnabled = computed(() => store.getters["game/isFullscreenEnabled"]);

  const toggleMusic = () => {
    store.dispatch("game/toggleMusic");
  };

  const toggleSound = () => {
    store.dispatch("game/toggleSound");
  };

  const toggleFullscreen = () => {
    store.dispatch("game/toggleFullscreen");
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
