<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  countLabel?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="page-header">
    <h1 class="page-title">{{ title }}</h1>
    <div v-if="count !== undefined" class="page-count">
      <span class="count-number">{{ count }}</span>
      <span class="count-label">{{ countLabel || "Items" }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  @include flex-between;
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-lg;
  border-bottom: 2px solid $border;

  @include mobile {
    flex-direction: column;
    gap: $spacing-md;
    align-items: flex-start;
  }
}

.page-title {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  text-shadow:
    3px 3px 0 $primary,
    6px 6px 0 $black-50;
  margin: 0;

  @include mobile {
    font-size: $font-size-2xl;
  }
}

.page-count {
  @include flex-center;
  gap: $spacing-sm;
  background: $surface;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-lg;
  border: 1px solid $border;
}

.count-number {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $primary;
}

.count-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  text-transform: uppercase;
}
</style>
