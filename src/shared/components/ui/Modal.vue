<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const close = () => {
  emit("update:modelValue", false);
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close();
  }
};
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="handleBackdropClick">
      <div class="modal-container">
        <div class="modal-content">
          <div v-if="title" class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="close-btn" @click="close" aria-label="Close">
              <span class="pixel-close-x"></span>
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-overlay {
  @include absolute-fill;
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  @include flex-center;
  z-index: $z-modal;
  backdrop-filter: blur(4px);
}

.modal-container {
  @include flex-center;
  padding: $spacing-lg;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-content {
  background: $surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-xl;
  max-width: 600px;
  width: 100%;
  position: relative;
  border: 1px solid $border;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 2px solid $border;
  background: $primary;

  .modal-title {
    margin: 0;
    color: $white;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
}

.close-btn {
  @include button-reset;
  width: 32px;
  height: 32px;
  @include flex-center;
  border-radius: 6px; // Pixel art için keskin köşeler
  color: $white;
  border: 2px solid $white;
  background: transparent;
  transition: all 0.15s ease; // Daha hızlı animasyon
  @include pixelated; // Pixel art mixin

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: $white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.pixel-close-x {
  position: relative;
  width: 16px;
  height: 16px;
  display: block;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 2px;
    background: currentColor;
    transform-origin: center;
    @include pixelated;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}

.modal-body {
  padding: $spacing-xl;
  max-height: 60vh;
  overflow-y: auto;

  @include mobile {
    padding: $spacing-lg;
  }
}

// Transition animations
.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-base;

  .modal-content {
    transition: transform $transition-base;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: scale(0.9) translateY(-20px);
  }
}
</style>
