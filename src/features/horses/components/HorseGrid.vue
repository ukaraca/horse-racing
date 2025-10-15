<script setup lang="ts">
import type { IHorse } from "@/utils/types";
import HorseCard from "./HorseCard.vue";

interface Props {
  horses: IHorse[];
}

defineProps<Props>();
</script>

<template>
  <div class="horse-grid">
    <HorseCard v-for="horse in horses" :key="horse.id" :horse="horse" />
  </div>
</template>

<style scoped lang="scss">
.horse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;
  animation: fadeInUp 0.6s ease-out;

  @include mobile {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include desktop {
    grid-template-columns: repeat(3, 1fr);
  }

  @include large-desktop {
    grid-template-columns: repeat(4, 1fr);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
