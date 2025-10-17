import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Store } from "vuex";

import type { GameAction, GameGetter } from "@/app/store/constants";
import type { IGameState } from "@/app/store/types";

// Mock Vuex store
const mockStore: Partial<Store<{ game: IGameState }>> = {
  getters: {
    "game/someGetter": "testValue",
  },
  commit: vi.fn(),
  dispatch: vi.fn(),
};

// Mock Vuex's useStore function
vi.mock("vuex", () => ({
  useStore: vi.fn(() => mockStore),
  createStore: vi.fn(),
}));

// Mock constants
vi.mock("@/app/store/constants", () => ({
  GAME_GETTERS: {
    SOME_GETTER: "game/someGetter" as GameGetter,
  },
  GAME_ACTIONS: {
    GENERATE_HORSES: "game/generateHorses" as GameAction,
  },
}));

describe("useStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide getGetter function", async () => {
    const { useStore } = await import("../useStore");
    const { getGetter } = useStore();

    expect(typeof getGetter).toBe("function");

    const horses = getGetter("game/someGetter" as GameGetter);
    expect(horses).toEqual("testValue");
  });

  it("should provide dispatchAction function", async () => {
    const { useStore } = await import("../useStore");
    const { dispatchAction } = useStore();

    expect(typeof dispatchAction).toBe("function");
  });

  it("should provide commitMutation function", async () => {
    const { useStore } = await import("../useStore");
    const { commitMutation } = useStore();

    expect(typeof commitMutation).toBe("function");
  });

  it("should provide GAME_GETTERS constants", async () => {
    const { useStore } = await import("../useStore");
    const { GAME_GETTERS } = useStore();

    expect(GAME_GETTERS).toBeDefined();
    expect(typeof GAME_GETTERS).toBe("object");
  });

  it("should provide GAME_ACTIONS constants", async () => {
    const { useStore } = await import("../useStore");
    const { GAME_ACTIONS } = useStore();

    expect(GAME_ACTIONS).toBeDefined();
    expect(typeof GAME_ACTIONS).toBe("object");
  });

  it("should handle store operations", async () => {
    const { useStore } = await import("../useStore");
    const { dispatchAction, commitMutation, GAME_ACTIONS } = useStore();

    // Test dispatch
    await dispatchAction(GAME_ACTIONS.GENERATE_HORSES);
    expect(mockStore.dispatch).toHaveBeenCalledWith(GAME_ACTIONS.GENERATE_HORSES, undefined);

    // Test commit
    commitMutation("SET_HORSES", [{ id: "H01", name: "Test Horse" }]);
    expect(mockStore.commit).toHaveBeenCalledWith("SET_HORSES", [
      { id: "H01", name: "Test Horse" },
    ]);
  });
});
