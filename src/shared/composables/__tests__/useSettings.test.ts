import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSettings } from "../useSettings";

// Mock useStore
const mockGetGetter = vi.fn();
const mockDispatchAction = vi.fn();

vi.mock("@/shared/composables", () => ({
  useStore: () => ({
    getGetter: mockGetGetter,
    dispatchAction: mockDispatchAction,
    GAME_GETTERS: {
      SETTINGS: "game/settings",
      IS_MUSIC_ENABLED: "game/isMusicEnabled",
      IS_SOUND_ENABLED: "game/isSoundEnabled",
      IS_FULLSCREEN_ENABLED: "game/isFullscreenEnabled",
    },
    GAME_ACTIONS: {
      TOGGLE_MUSIC: "game/toggleMusic",
      TOGGLE_SOUND: "game/toggleSound",
      TOGGLE_FULLSCREEN: "game/toggleFullscreen",
    },
  }),
}));

describe("useSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock default getter returns
    mockGetGetter.mockImplementation((getter: string) => {
      switch (getter) {
        case "game/settings":
          return {
            isMusicEnabled: true,
            isSoundEnabled: false,
            isFullscreenEnabled: true,
          };
        case "game/isMusicEnabled":
          return true;
        case "game/isSoundEnabled":
          return false;
        case "game/isFullscreenEnabled":
          return true;
        default:
          return undefined;
      }
    });
  });

  it("should provide settings state and methods", () => {
    const {
      settings,
      isMusicEnabled,
      isSoundEnabled,
      isFullscreenEnabled,
      toggleMusic,
      toggleSound,
      toggleFullscreen,
    } = useSettings();

    expect(settings.value).toBeDefined();
    expect(isMusicEnabled.value).toBe(true);
    expect(isSoundEnabled.value).toBe(false);
    expect(isFullscreenEnabled.value).toBe(true);

    expect(typeof toggleMusic).toBe("function");
    expect(typeof toggleSound).toBe("function");
    expect(typeof toggleFullscreen).toBe("function");
  });

  it("should return computed settings object", () => {
    const { settings } = useSettings();

    expect(settings.value).toEqual({
      isMusicEnabled: true,
      isSoundEnabled: false,
      isFullscreenEnabled: true,
    });

    expect(mockGetGetter).toHaveBeenCalledWith("game/settings");
  });

  it("should return computed music enabled state", () => {
    const { isMusicEnabled } = useSettings();

    expect(isMusicEnabled.value).toBe(true);
    expect(mockGetGetter).toHaveBeenCalledWith("game/isMusicEnabled");
  });

  it("should return computed sound enabled state", () => {
    const { isSoundEnabled } = useSettings();

    expect(isSoundEnabled.value).toBe(false);
    expect(mockGetGetter).toHaveBeenCalledWith("game/isSoundEnabled");
  });

  it("should return computed fullscreen enabled state", () => {
    const { isFullscreenEnabled } = useSettings();

    expect(isFullscreenEnabled.value).toBe(true);
    expect(mockGetGetter).toHaveBeenCalledWith("game/isFullscreenEnabled");
  });

  it("should toggle music when toggleMusic is called", () => {
    const { toggleMusic } = useSettings();

    toggleMusic();

    expect(mockDispatchAction).toHaveBeenCalledWith("game/toggleMusic");
  });

  it("should toggle sound when toggleSound is called", () => {
    const { toggleSound } = useSettings();

    toggleSound();

    expect(mockDispatchAction).toHaveBeenCalledWith("game/toggleSound");
  });

  it("should toggle fullscreen when toggleFullscreen is called", () => {
    const { toggleFullscreen } = useSettings();

    toggleFullscreen();

    expect(mockDispatchAction).toHaveBeenCalledWith("game/toggleFullscreen");
  });

  it("should handle reactive state changes", () => {
    // Test that computed values work correctly with different mock implementations
    const { isMusicEnabled, isSoundEnabled } = useSettings();

    // Initial state
    expect(isMusicEnabled.value).toBe(true);
    expect(isSoundEnabled.value).toBe(false);

    // Create new instances with different mock values
    mockGetGetter.mockImplementation((getter: string) => {
      switch (getter) {
        case "game/isMusicEnabled":
          return false;
        case "game/isSoundEnabled":
          return true;
        default:
          return undefined;
      }
    });

    const { isMusicEnabled: newIsMusicEnabled, isSoundEnabled: newIsSoundEnabled } = useSettings();

    // New instances should reflect the new mock values
    expect(newIsMusicEnabled.value).toBe(false);
    expect(newIsSoundEnabled.value).toBe(true);
  });
});
