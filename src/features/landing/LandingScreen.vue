<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";

const router = useRouter();

const handlePlay = () => {
  router.push({ name: "race-management" });
};
</script>

<template>
  <div class="landing-screen">
    <div class="pixel-overlay"></div>

    <div class="landing-content">
      <div class="title-section">
        <h1 class="game-title">
          <span class="title-word">HORSE</span>
          <span class="title-word">RACING</span>
        </h1>
        <p class="subtitle">PRESS PLAY TO START</p>
      </div>

      <div class="action-section">
        <BaseButton size="lg" @click="handlePlay">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="margin-right: 8px"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          PLAY
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.landing-screen {
  @include flex-column-center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: $spacing-xl;

  background-image: url("/assets/images/landing-bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @include pixelated;

  @media (max-width: 768px) {
    background-size: auto 100%;
    background-position: center center;
  }

  @media (min-width: 769px) and (max-width: 1200px) {
    background-size: cover;
  }

  @media (min-width: 1201px) {
    background-size: 100% auto;
    background-position: center center;
  }

  @include mobile {
    padding: $spacing-lg;
  }
}

.pixel-overlay {
  @include absolute-fill;
  position: absolute;
  background: linear-gradient(to bottom, $black-30 0%, $black-50 100%);
  pointer-events: none;
  z-index: 1;
}

.landing-content {
  @include flex-column-center;
  gap: $spacing-xxl;
  z-index: 10;
  text-align: center;
  animation: fadeInUp 1s ease-out;
  position: relative;

  @include mobile {
    gap: $spacing-xl;
  }
}

.title-section {
  @include flex-column-center;
  gap: $spacing-lg;
}

.game-title {
  @include flex-column-center;
  gap: $spacing-md;
  margin: 0;
}

.title-word {
  font-size: clamp(1.5rem, 8vw, 3rem);
  letter-spacing: 0.2em;
  color: $text-primary;
  @include pixel-text-shadow($black, rgba(0, 0, 0, 0.5), $shadow-offset-lg, $shadow-offset-xl);
  animation: glow 2s ease-in-out infinite alternate;
  line-height: 1.5;

  @include mobile {
    letter-spacing: 0.1em;
    font-size: clamp(1rem, 6vw, 2rem);
  }
}

.subtitle {
  font-size: clamp(0.5rem, 2vw, 0.75rem);
  color: $gold;
  margin: 0;
  @include pixel-text-shadow-sm($black, rgba(0, 0, 0, 0.5), $shadow-offset-sm, $shadow-offset-lg);
  animation: blink 2s ease-in-out infinite;

  @include mobile {
    font-size: clamp(0.4rem, 1.5vw, 0.6rem);
  }
}

.action-section {
  @include flex-center;
  margin-top: $spacing-xl;

  button {
    font-size: clamp(0.6rem, 2vw, 0.875rem);
    padding: $spacing-lg $spacing-xxl;
    min-width: 200px;
    @include retro-shadow-multi(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3), 2px);
    animation: pulse 2s ease-in-out infinite;
    border: 4px solid $black;
    position: relative;

    @include mobile {
      min-width: 160px;
      font-size: clamp(0.5rem, 1.5vw, 0.75rem);
      padding: $spacing-md $spacing-xl;
    }

    &:hover {
      animation: none;
      transform: translate(2px, 2px);
      @include retro-shadow-multi(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3), 2px);
    }

    &:active {
      transform: translate(4px, 4px);
      box-shadow: none;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(1.2);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes blink {
  0%,
  49%,
  100% {
    opacity: 1;
  }
  50%,
  99% {
    opacity: 0.5;
  }
}
</style>
