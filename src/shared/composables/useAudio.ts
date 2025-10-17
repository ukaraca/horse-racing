import { ref, computed, onUnmounted, watch } from "vue";
import { useStore } from "./useStore";
import { AUDIO_KEYS, AUDIO_FILES, type AudioKey } from "@/shared/constants";

interface AudioTrack {
  audio: HTMLAudioElement;
  isPlaying: boolean;
  normalVolume: number;
}

export function useAudio() {
  const { getGetter, GAME_GETTERS } = useStore();

  const audioTracks = ref<Map<AudioKey, AudioTrack>>(new Map());

  const isMusicEnabled = computed(() => getGetter(GAME_GETTERS.IS_MUSIC_ENABLED));
  const isSoundEnabled = computed(() => getGetter(GAME_GETTERS.IS_SOUND_ENABLED));

  const createAudio = (
    src: string,
    options: { loop?: boolean; volume?: number } = {},
  ): AudioTrack => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = options.volume ?? 1.0;
    audio.loop = options.loop ?? false;

    audio.addEventListener("ended", () => {
      for (const [, track] of audioTracks.value.entries()) {
        if (track.audio === audio) {
          track.isPlaying = false;
          break;
        }
      }
    });

    audio.addEventListener("error", (e) => {
      console.warn(`Audio error for ${src}:`, e);
      for (const [, track] of audioTracks.value.entries()) {
        if (track.audio === audio) {
          track.isPlaying = false;
          break;
        }
      }
    });

    return {
      audio,
      isPlaying: false,
      normalVolume: options.volume ?? 1.0,
    };
  };

  const updateAudioVolume = () => {
    audioTracks.value.forEach((track, key) => {
      if (key === AUDIO_KEYS.AMBIENCE) {
        track.audio.volume = isMusicEnabled.value ? track.normalVolume : 0;
      } else {
        track.audio.volume = isSoundEnabled.value ? track.normalVolume : 0;
      }
    });
  };

  const playAudio = async (key: AudioKey) => {
    const track = audioTracks.value.get(key);
    if (!track) return;

    try {
      if (!track.audio.paused) {
        return;
      }

      track.audio.currentTime = 0;
      if (track.audio.readyState < 2) {
        await track.audio.load();
      }

      updateAudioVolume();

      await track.audio.play();
      track.isPlaying = true;
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.warn(`Failed to play audio ${key}:`, error);
      }
      track.isPlaying = false;
    }
  };

  const stopAudio = (key: AudioKey) => {
    const track = audioTracks.value.get(key);
    if (!track) return;

    if (track.audio.paused) {
      return;
    }

    track.audio.pause();
    track.audio.currentTime = 0;
    track.isPlaying = false;
  };

  const stopAllAudio = () => {
    audioTracks.value.forEach((track) => {
      if (!track.audio.paused) {
        track.audio.pause();
        track.audio.currentTime = 0;
        track.isPlaying = false;
      }
    });
  };

  const playAllRunSounds = async () => {
    await Promise.all([
      playAudio(AUDIO_KEYS.RUN1),
      playAudio(AUDIO_KEYS.RUN2),
      playAudio(AUDIO_KEYS.RUN3),
    ]);
  };

  const stopAllRunSounds = () => {
    stopAudio(AUDIO_KEYS.RUN1);
    stopAudio(AUDIO_KEYS.RUN2);
    stopAudio(AUDIO_KEYS.RUN3);
  };

  watch(isMusicEnabled, () => {
    updateAudioVolume();
  });

  watch(isSoundEnabled, () => {
    updateAudioVolume();
  });

  const initializeAudio = () => {
    audioTracks.value.set(
      AUDIO_KEYS.AMBIENCE,
      createAudio(AUDIO_FILES.ambience, { loop: true, volume: 0.6 }),
    );

    audioTracks.value.set(
      AUDIO_KEYS.CALL_TO_POST,
      createAudio(AUDIO_FILES[AUDIO_KEYS.CALL_TO_POST], { volume: 0.8 }),
    );
    audioTracks.value.set(
      AUDIO_KEYS.GATE,
      createAudio(AUDIO_FILES[AUDIO_KEYS.GATE], { volume: 0.9 }),
    );
    audioTracks.value.set(
      AUDIO_KEYS.RUN1,
      createAudio(AUDIO_FILES[AUDIO_KEYS.RUN1], { loop: true, volume: 0.7 }),
    );
    audioTracks.value.set(
      AUDIO_KEYS.RUN2,
      createAudio(AUDIO_FILES[AUDIO_KEYS.RUN2], { loop: true, volume: 0.7 }),
    );
    audioTracks.value.set(
      AUDIO_KEYS.RUN3,
      createAudio(AUDIO_FILES[AUDIO_KEYS.RUN3], { loop: true, volume: 0.7 }),
    );

    updateAudioVolume();
  };

  onUnmounted(() => {
    stopAllAudio();
    audioTracks.value.forEach((track) => {
      track.audio.remove();
    });
    audioTracks.value.clear();
  });

  return {
    audioTracks,
    isMusicEnabled,
    isSoundEnabled,
    initializeAudio,
    playAudio,
    stopAudio,
    stopAllAudio,
    playAllRunSounds,
    stopAllRunSounds,
  };
}
