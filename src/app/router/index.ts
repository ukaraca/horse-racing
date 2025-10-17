import { createRouter, createWebHistory } from "vue-router";

import { ROUTE_NAMES, ROUTE_PATHS } from "./routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTE_PATHS.LANDING,
      name: ROUTE_NAMES.LANDING,
      component: () => import("@/features/landing/pages/LandingPage.vue"),
    },
    {
      path: ROUTE_PATHS.RACE_MANAGEMENT,
      name: ROUTE_NAMES.RACE_MANAGEMENT,
      component: () => import("@/features/race-management/pages/RaceManagementPage.vue"),
    },
    {
      path: ROUTE_PATHS.RACE,
      name: ROUTE_NAMES.RACE,
      component: () => import("@/features/race/pages/RacePage.vue"),
    },
  ],
});

export default router;
