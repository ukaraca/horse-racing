<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { Button } from "@/shared/components/ui";
import PlayIcon from "../components/PlayIcon.vue";
import { useNavigation } from "@/shared/composables";
import { GAME_TITLE, SUBTITLE_TEXT } from "../constants/landing-texts";

const { navigateTo, ROUTE_NAMES } = useNavigation();

const handlePlay = async () => {
  navigateTo(ROUTE_NAMES.RACE_MANAGEMENT);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handlePlay();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="landing-screen">
    <div class="pixel-overlay"></div>

    <div class="landing-content">
      <div class="title-section">
        <h1 class="game-title">
          <span class="title-word">{{ GAME_TITLE.first }}</span>
          <span class="title-word">{{ GAME_TITLE.second }}</span>
        </h1>
        <p class="subtitle">{{ SUBTITLE_TEXT }}</p>
      </div>

      <div class="action-section">
        <Button size="lg" @click="handlePlay" class="play-button">
          <PlayIcon class="play-icon" />
          PLAY
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Landing Page Specific Styles
// Component-based styling for LandingPage.vue

.landing-screen {
  @include flex-column-center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: $spacing-xl;

  background-image: url("../images/landing-bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @include pixelated;

  @media (max-width: $breakpoint-mobile) {
    background-size: auto 100%;
    background-position: center center;
  }

  @media (min-width: $breakpoint-mobile) and (max-width: $breakpoint-desktop) {
    background-size: cover;
  }

  @media (min-width: $breakpoint-desktop) {
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
  @include fade-in-up;
  position: relative;

  @include mobile {
    gap: $spacing-xl;
  }
}

.title-section {
  @include flex-column-center;
  gap: $spacing-lg;
  text-align: center;
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
  @include glow-animation;
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
  @include blink-animation;

  @include mobile {
    font-size: clamp(0.4rem, 1.5vw, 0.6rem);
  }
}

.action-section {
  @include flex-center;
  margin-top: $spacing-xl;
}

.play-button {
  font-size: clamp(0.6rem, 2vw, 0.875rem);
  padding: $spacing-lg $spacing-xxl;
  min-width: 200px;
  @include retro-shadow-multi(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3), 2px);
  @include pulse-animation;
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

.play-icon {
  margin-right: $spacing-xs;
}
</style>
