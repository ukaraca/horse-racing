<script setup lang="ts">
interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

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
          <slot />
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
  padding: $spacing-xl;
  max-width: 600px;
  width: 100%;
  position: relative;
  border: 1px solid $border;

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
