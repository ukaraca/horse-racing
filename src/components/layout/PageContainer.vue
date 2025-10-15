<script setup lang="ts">
interface Props {
  gradient?: boolean;
}

withDefaults(defineProps<Props>(), {
  gradient: true,
});
</script>

<template>
  <div class="page-container" :class="{ 'page-container--gradient': gradient }">
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  width: 100%;
  padding: $spacing-xl 0;

  @include mobile {
    padding: $spacing-lg 0;
  }

  &--gradient {
    background:
      linear-gradient(0deg, $black-05 50%, transparent 50%),
      linear-gradient(135deg, $background 0%, $surface 100%);
    background-size:
      4px 4px,
      100% 100%;
  }
}
</style>
