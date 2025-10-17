import { useStore as vuexUseStore } from "vuex";
import type { Store } from "vuex";
import type { IGameState } from "@/app/store/types";
import type { PayloadType } from "@/shared/types/store";
import {
  GAME_GETTERS,
  GAME_ACTIONS,
  type GameGetter,
  type GameAction,
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
  const dispatchAction = (action: GameAction, payload?: PayloadType) => {
    return store.dispatch(action, payload);
  };

  /**
   * Type-safe mutation commit
   */
  return {
    store,
    getGetter,
    dispatchAction,
    getters: store.getters,
    dispatch: store.dispatch,
    commit: store.commit,

    GAME_GETTERS,
    GAME_ACTIONS,
  };
}
