import { useStore as vuexUseStore } from "vuex";
import type { Store } from "vuex";
import type { IGameState } from "@/app/store/types";
import {
  GAME_GETTERS,
  GAME_ACTIONS,
  GAME_MUTATIONS,
  type GameGetter,
  type GameAction,
  type GameMutation,
} from "@/app/store/constants";

/**
 * Type-safe Vuex store composable
 */
export function useStore() {
  const store = vuexUseStore() as Store<{ game: IGameState }>;

  /**
   * Type-safe getter access
   */
  const getGetter = <T = any>(getter: GameGetter): T => {
    return store.getters[getter] as T;
  };

  /**
   * Type-safe action dispatch
   */
  const dispatchAction = (action: GameAction, payload?: any) => {
    return store.dispatch(action, payload);
  };

  /**
   * Type-safe mutation commit
   */
  const commitMutation = (mutation: GameMutation, payload?: any) => {
    return store.commit(mutation, payload);
  };

  return {
    // Original store instance
    store,

    // Type-safe methods
    getGetter,
    dispatchAction,
    commitMutation,

    // Direct access to getters for convenience
    getters: store.getters,
    dispatch: store.dispatch,
    commit: store.commit,

    // Export constants for convenience
    GAME_GETTERS,
    GAME_ACTIONS,
    GAME_MUTATIONS,
  };
}
