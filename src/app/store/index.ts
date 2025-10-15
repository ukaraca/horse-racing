import { createStore } from "vuex";
import game from "./modules/game";

const store = createStore({
  modules: { game },
  strict: import.meta.env.MODE !== "production",
});

export default store;
