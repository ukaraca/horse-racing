import type { Plugin } from "vuex";
import { createStore, Store } from "vuex";

import { GAME_ACTIONS, LOCALSTORAGE_KEYS } from "./constants";
import game from "./modules/game";
import type { IGameState } from "./types";

interface RootState {
  game: IGameState;
}

const localStoragePlugin: Plugin<RootState> = (store: Store<RootState>) => {
  store.subscribeAction({
    after: (action, state) => {
      if (
        action.type === GAME_ACTIONS.TOGGLE_MUSIC ||
        action.type === GAME_ACTIONS.TOGGLE_SOUND ||
        action.type === GAME_ACTIONS.UPDATE_SETTINGS
      ) {
        try {
          localStorage.setItem(
            LOCALSTORAGE_KEYS.SETTINGS,
            JSON.stringify({
              isMusicEnabled: state.game.settings.isMusicEnabled,
              isSoundEnabled: state.game.settings.isSoundEnabled,
            }),
          );
        } catch (error) {
          console.warn("Failed to save settings to localStorage:", error);
        }
      }
    },
  });
};

const store = createStore({
  modules: { game },
  plugins: [localStoragePlugin],
  strict: import.meta.env.MODE !== "production",
});

export default store;
