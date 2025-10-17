<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const toggle = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>

<template>
  <div class="base-toggle">
    <button
      type="button"
      class="toggle-switch"
      :class="{
        'toggle-switch--active': modelValue,
        'toggle-switch--disabled': disabled,
      }"
      :disabled="disabled"
      @click="toggle"
      role="switch"
      :aria-checked="modelValue"
    >
      <span class="toggle-slider"></span>
    </button>
    <label v-if="label" class="toggle-label" @click="toggle">
      {{ label }}
    </label>
  </div>
</template>

<style scoped lang="scss">
.base-toggle {
  @include flex-between;
  gap: $spacing-md;
}

.toggle-switch {
  @include button-reset;
  width: 50px;
  height: 26px;
  background: $surface-light;
  border-radius: $radius-full;
  position: relative;
  transition: background $transition-base;
  border: 2px solid $border;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: $surface-lighter;
  }

  &--active {
    background: $primary;
    border-color: $primary;

    .toggle-slider {
      transform: translateX(24px);
    }

    &:hover:not(:disabled) {
      background: $primary-dark;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  transition: transform $transition-base;
  box-shadow: $shadow-sm;
}

.toggle-label {
  color: $text-primary;
  font-size: $font-size-base;
  user-select: none;
  cursor: pointer;
  flex: 1;
}
</style>
