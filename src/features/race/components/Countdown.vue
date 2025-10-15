<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Emits {
  (e: "complete"): void;
}

const COUNTDOWN_NUMBER = 3;

const emit = defineEmits<Emits>();

const currentNumber = ref(COUNTDOWN_NUMBER);
const isVisible = ref(true);

onMounted(() => {
  const interval = setInterval(() => {
    if (currentNumber.value > 1) {
      currentNumber.value--;
    } else {
      clearInterval(interval);
      isVisible.value = false;
      emit("complete");
    }
  }, 1000);
});
</script>

<template>
  <Transition name="countdown">
    <div v-if="isVisible" class="countdown-overlay">
      <div class="countdown-number">{{ currentNumber }}</div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.countdown-overlay {
  @include absolute-fill;
  @include flex-center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  pointer-events: none;
}

.countdown-number {
  font-size: clamp(4rem, 20vw, 12rem);
  font-weight: $font-weight-bold;
  color: $white;
  text-shadow:
    8px 8px 0 var(--color-primary),
    16px 16px 0 $black-80;
  animation: pulse-countdown 1s ease-in-out infinite;
  line-height: 1;
}

@keyframes pulse-countdown {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

.countdown-enter-active,
.countdown-leave-active {
  transition: opacity 0.3s ease;
}

.countdown-enter-from,
.countdown-leave-to {
  opacity: 0;
}
</style>
