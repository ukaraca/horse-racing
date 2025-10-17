<script setup lang="ts">
defineEmits<{
  click: [];
}>();
</script>

<template>
  <button class="settings-button" @click="$emit('click')" aria-label="Settings">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 1v6m0 6v6m0-18c-2 0-4 1-5 2l3 2m2-4c2 0 4 1 5 2l-3 2m-4 12c-1-1-2-3-2-5m16 5c0-2-1-4-2-5m-12-2c-2 0-4-1-5-2l2-3m4 5c2 0 4-1 5-2l-2-3m2 12l-3 2m8-2l-3-2"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      />
    </svg>
  </button>
</template>

<style scoped lang="scss">
.settings-button {
  @include button-reset;
  position: fixed;
  top: $spacing-lg;
  right: $spacing-lg;
  width: 48px;
  height: 48px;
  background: $primary;
  border-radius: 0;
  @include flex-center;
  color: $white;
  border: 3px solid $black;
  @include retro-shadow-multi(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3), 2px);
  transition: all $transition-base;
  z-index: 100;

  svg {
    width: 24px;
    height: 24px;
    transition: transform $transition-base;
  }

  &:hover {
    background: $primary-dark;
    transform: translate(2px, 2px);
    @include retro-shadow-multi(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3), 2px);

    svg {
      transform: rotate(45deg);
    }
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid $primary-light;
    outline-offset: 2px;
  }

  @include mobile {
    width: 44px;
    height: 44px;
    top: $spacing-md;
    right: $spacing-md;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
