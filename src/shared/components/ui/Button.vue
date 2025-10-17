<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
});

const classes = computed(() => [
  "base-button",
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  props.disabled && "base-button--disabled",
]);
</script>

<template>
  <button :class="classes" :disabled="disabled" type="button">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.base-button {
  @include button-base;
  font-weight: $font-weight-semibold;
  border: 3px solid $black;
  cursor: pointer;
  user-select: none;
  @include retro-shadow($black-60);

  &--primary {
    background: $primary;
    color: $white;

    &:hover:not(:disabled) {
      background: $primary-dark;
      transform: translate(2px, 2px);
      box-shadow:
        2px 2px 0 $black-60,
        4px 4px 0 $black-30;
    }

    &:active:not(:disabled) {
      transform: translate(4px, 4px);
      box-shadow: none;
    }
  }

  &--secondary {
    background: $secondary;
    color: $white;

    &:hover:not(:disabled) {
      background: $secondary-dark;
      transform: translate(2px, 2px);
      box-shadow:
        2px 2px 0 $black-60,
        4px 4px 0 $black-30;
    }

    &:active:not(:disabled) {
      transform: translate(4px, 4px);
      box-shadow: none;
    }
  }

  &--sm {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-sm;
  }

  &--md {
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-base;
  }

  &--lg {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-lg;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid $primary-light;
    outline-offset: 2px;
  }
}
</style>
