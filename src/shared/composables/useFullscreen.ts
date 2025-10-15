import { ref, onMounted, onUnmounted } from "vue";

export function useFullscreen() {
  const isFullscreen = ref(false);

  const updateFullscreenState = () => {
    isFullscreen.value = !!document.fullscreenElement;
  };

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        isFullscreen.value = true;
      }
    } catch (error) {
      console.error("Error entering fullscreen:", error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        isFullscreen.value = false;
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
  };

  const toggleFullscreen = async () => {
    if (isFullscreen.value) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  };

  onMounted(() => {
    document.addEventListener("fullscreenchange", updateFullscreenState);
    updateFullscreenState();
  });

  onUnmounted(() => {
    document.removeEventListener("fullscreenchange", updateFullscreenState);
  });

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
