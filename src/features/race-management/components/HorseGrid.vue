<script setup lang="ts">
import type { IHorse } from "@/shared/types";
import HorseCard from "./HorseCard.vue";

interface Props {
  horses: IHorse[];
}

const { horses } = defineProps<Props>();
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
  @include fade-in-up(0.6s);

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
</style>
