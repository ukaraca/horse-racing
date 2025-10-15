<script setup lang="ts">
import { computed } from "vue";
import BaseModal from "@/components/base/BaseModal.vue";
import BaseToggle from "@/components/base/BaseToggle.vue";
import { useSettings } from "@/composables/useSettings";
import { useFullscreen } from "@/composables/useFullscreen";

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

const handleClose = () => {
  emit("update:modelValue", false);
};

const handleFullscreenToggle = async () => {
  await toggleFullscreenMode();
};

const fullscreenActive = computed(() => isFullscreen.value);
</script>

<template>
  <BaseModal :model-value="modelValue" @update:model-value="handleClose">
    <div class="settings-panel">
      <div class="settings-header">
        <h2>Settings</h2>
        <button class="close-button" @click="handleClose" aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="settings-content">
        <div class="setting-item">
          <BaseToggle
            :model-value="isMusicEnabled"
            label="Music"
            @update:model-value="toggleMusic"
          />
        </div>

        <div class="setting-item">
          <BaseToggle
            :model-value="isSoundEnabled"
            label="Sound Effects"
            @update:model-value="toggleSound"
          />
        </div>

        <div class="setting-item">
          <BaseToggle
            :model-value="fullscreenActive"
            label="Fullscreen"
            @update:model-value="handleFullscreenToggle"
          />
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.settings-panel {
  min-width: 400px;

  @include mobile {
    min-width: unset;
  }
}

.settings-header {
  @include flex-between;
  margin-bottom: $spacing-xl;

  h2 {
    font-size: $font-size-xl;
    color: $text-primary;
    margin: 0;
    line-height: 1.5;
  }
}

.close-button {
  @include button-reset;
  width: 32px;
  height: 32px;
  @include flex-center;
  border-radius: $radius-md;
  color: $text-secondary;
  transition: all $transition-fast;

  &:hover {
    background: $surface-light;
    color: $text-primary;
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.settings-content {
  display: flex;
  flex-direction: column;
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
