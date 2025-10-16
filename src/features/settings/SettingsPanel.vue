<script setup lang="ts">
import { computed } from "vue";
import { Modal, Toggle } from "@/shared/components/ui";
import { useSettings, useFullscreen } from "@/shared/composables";

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

const handleFullscreenToggle = async () => {
  await toggleFullscreenMode();
};

const fullscreenActive = computed(() => isFullscreen.value);
</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="Settings"
  >
    <div class="settings-content">
      <div class="setting-item">
        <Toggle
          :model-value="isMusicEnabled"
          label="Ambience Music"
          @update:model-value="toggleMusic"
        />
      </div>

      <div class="setting-item">
        <Toggle
          :model-value="isSoundEnabled"
          label="Sound Effects"
          @update:model-value="toggleSound"
        />
      </div>

      <div class="setting-item">
        <Toggle
          :model-value="fullscreenActive"
          label="Fullscreen"
          @update:model-value="handleFullscreenToggle"
        />
      </div>
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
