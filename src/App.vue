<script setup lang="ts">
import { ref } from "vue";
import SettingsButton from "@/features/settings/SettingsButton.vue";
import SettingsPanel from "@/features/settings/SettingsPanel.vue";

const showSettings = ref(false);

const handleOpenSettings = () => {
  showSettings.value = true;
};
</script>

<template>
  <div id="app">
    <RouterView />
    <SettingsButton @click="handleOpenSettings" />
    <SettingsPanel v-model="showSettings" />
  </div>
</template>

<style lang="scss">
// Global app styles are in src/styles/main.scss
#app {
  min-height: 100vh;
  width: 100%;
}
</style>
