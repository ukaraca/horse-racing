<script setup lang="ts">
interface Props {
  size?: number;
  class?: string;
}

withDefaults(defineProps<Props>(), {
  size: 16,
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    :class="class"
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
</template>
