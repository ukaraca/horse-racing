import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("@/features/landing/LandingScreen.vue"),
    },
    {
      path: "/race-management",
      name: "race-management",
      component: () => import("@/features/horses/HorseList.vue"),
    },
    {
      path: "/race",
      name: "race",
      component: () => import("@/features/race/RaceTrack.vue"),
    },
  ],
});

export default router;
