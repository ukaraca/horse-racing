import type { Store } from "vuex";
import { useStore as vuexUseStore } from "vuex";

import {
  GAME_ACTIONS,
  GAME_GETTERS,
  type GameAction,
  type GameGetter,
} from "@/app/store/constants";
import type { IGameState } from "@/app/store/types";
import type { PayloadType } from "@/shared/types/store";

/**
 * Type-safe Vuex store composable
 */
export function useStore() {
  const store = vuexUseStore() as Store<{ game: IGameState }>;

  /**
   * Type-safe getter access
   */
  const getGetter = <T = unknown>(getter: GameGetter): T => {
    return store.getters[getter] as T;
  };

  /**
   * Type-safe action dispatch
   */
  const dispatchAction = (action: GameAction, payload?: PayloadType) => {
    return store.dispatch(action, payload);
  };

  /**
   * Type-safe mutation commit
   */
  const commitMutation = (mutation: string, payload?: PayloadType) => {
    return store.commit(mutation, payload);
  };

  return {
    store,
    getGetter,
    dispatchAction,
    commitMutation,
    getters: store.getters,
    dispatch: store.dispatch,
    commit: store.commit,

    GAME_GETTERS,
    GAME_ACTIONS,
  };
}
