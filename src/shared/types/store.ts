import type { Router } from "vue-router";
import type { Store } from "vuex";

import type { IGameState } from "@/app/store/types";

// Vuex Store type
export type AppStore = Store<IGameState>;

// Vue Router type
export type AppRouter = Router;

// Generic payload type for actions/mutations
export type PayloadType =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null
  | undefined;
