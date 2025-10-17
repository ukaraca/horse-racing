<script setup lang="ts">
import { computed } from "vue";
import { Modal, Toggle, Button } from "@/shared/components/ui";
import { useSettings, useFullscreen, useNavigation, useStore } from "@/shared/composables";
import {
  SETTINGS_TITLE,
  AMBIENCE_MUSIC_LABEL,
  SOUND_EFFECTS_LABEL,
  FULLSCREEN_LABEL,
  RETURN_TO_MENU_TEXT,
} from "./constants/settings-texts";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { isMusicEnabled, isSoundEnabled, toggleMusic, toggleSound } = useSettings();
const { isFullscreen, toggleFullscreen: toggleFullscreenMode } = useFullscreen();
const { navigateTo, ROUTE_NAMES } = useNavigation();
const { dispatchAction, GAME_ACTIONS } = useStore();

const handleFullscreenToggle = async () => {
  await toggleFullscreenMode();
};

const handleReturnToMenu = async () => {
  emit("update:modelValue", false);
  await dispatchAction(GAME_ACTIONS.RESET_GAME);
  navigateTo(ROUTE_NAMES.LANDING);
};

const fullscreenActive = computed(() => isFullscreen.value);
</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="SETTINGS_TITLE"
  >
    <div class="settings-content">
      <div class="setting-item">
        <Toggle
          :model-value="isMusicEnabled"
          :label="AMBIENCE_MUSIC_LABEL"
          @update:model-value="toggleMusic"
        />
      </div>

      <div class="setting-item">
        <Toggle
          :model-value="isSoundEnabled"
          :label="SOUND_EFFECTS_LABEL"
          @update:model-value="toggleSound"
        />
      </div>

      <div class="setting-item">
        <Toggle
          :model-value="fullscreenActive"
          :label="FULLSCREEN_LABEL"
          @update:model-value="handleFullscreenToggle"
        />
      </div>

      <Button @click="handleReturnToMenu" variant="secondary">{{ RETURN_TO_MENU_TEXT }}</Button>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.settings-content {
  @include flex-column;
  gap: $spacing-lg;
}

.setting-item {
  padding: $spacing-md;
  background: $surface-light;
  border-radius: $radius-md;
  border: 1px solid $border;
  transition: background $transition-fast;

  &:hover {
    background: $surface-lighter;
  }
}
</style>
