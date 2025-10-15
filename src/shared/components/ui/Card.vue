<script setup lang="ts">
import { computed } from "vue";

interface Props {
  padding?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padding: "md",
  hoverable: false,
});

const classes = computed(() => [
  "base-card",
  `base-card--${props.padding}`,
  {
    "base-card--hoverable": props.hoverable,
  },
]);
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.base-card {
  background: $surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  transition: all $transition-base;
  border: 1px solid $border;

  &--sm {
    padding: $spacing-sm;
  }

  &--md {
    padding: $spacing-md;
  }

  &--lg {
    padding: $spacing-lg;
  }

  &--hoverable {
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-lg;
      border-color: $border-light;
    }
  }
}
</style>
