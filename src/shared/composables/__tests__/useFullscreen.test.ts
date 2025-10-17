import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useFullscreen } from "../useFullscreen";

// Mock document methods
const mockRequestFullscreen = vi.fn();
const mockExitFullscreen = vi.fn();

Object.defineProperty(document, "fullscreenElement", {
  writable: true,
  value: null,
});

Object.defineProperty(document.documentElement, "requestFullscreen", {
  writable: true,
  value: mockRequestFullscreen,
});

Object.defineProperty(document, "exitFullscreen", {
  writable: true,
  value: mockExitFullscreen,
});

describe("useFullscreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.fullscreenElement = null;
    mockRequestFullscreen.mockClear();
    mockExitFullscreen.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should provide fullscreen state and methods", () => {
    const { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen } = useFullscreen();

    expect(isFullscreen.value).toBe(false);
    expect(typeof enterFullscreen).toBe("function");
    expect(typeof exitFullscreen).toBe("function");
    expect(typeof toggleFullscreen).toBe("function");
  });

  it("should update fullscreen state when entering fullscreen", async () => {
    const { isFullscreen, enterFullscreen } = useFullscreen();

    mockRequestFullscreen.mockResolvedValue(undefined);

    await enterFullscreen();

    expect(isFullscreen.value).toBe(true);
    expect(mockRequestFullscreen).toHaveBeenCalled();
  });

  it("should not enter fullscreen if already in fullscreen", async () => {
    const { enterFullscreen } = useFullscreen();

    document.fullscreenElement = document.documentElement;

    await enterFullscreen();

    expect(mockRequestFullscreen).not.toHaveBeenCalled();
  });

  it("should handle fullscreen request errors", async () => {
    const { enterFullscreen } = useFullscreen();

    mockRequestFullscreen.mockRejectedValue(new Error("Fullscreen failed"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await enterFullscreen();

    expect(consoleSpy).toHaveBeenCalledWith("Error entering fullscreen:", expect.any(Error));
    expect(mockRequestFullscreen).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should update fullscreen state when exiting fullscreen", async () => {
    const { isFullscreen, exitFullscreen } = useFullscreen();

    // Start in fullscreen
    document.fullscreenElement = document.documentElement;
    isFullscreen.value = true;

    mockExitFullscreen.mockResolvedValue(undefined);

    await exitFullscreen();

    expect(isFullscreen.value).toBe(false);
    expect(mockExitFullscreen).toHaveBeenCalled();
  });

  it("should not exit fullscreen if not in fullscreen", async () => {
    const { exitFullscreen } = useFullscreen();

    document.fullscreenElement = null;

    await exitFullscreen();

    expect(mockExitFullscreen).not.toHaveBeenCalled();
  });

  it("should handle fullscreen exit errors", async () => {
    const { exitFullscreen } = useFullscreen();

    // Start in fullscreen
    document.fullscreenElement = document.documentElement;

    mockExitFullscreen.mockRejectedValue(new Error("Exit fullscreen failed"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await exitFullscreen();

    expect(consoleSpy).toHaveBeenCalledWith("Error exiting fullscreen:", expect.any(Error));
    expect(mockExitFullscreen).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should toggle fullscreen correctly when not in fullscreen", async () => {
    const { isFullscreen, toggleFullscreen } = useFullscreen();

    mockRequestFullscreen.mockResolvedValue(undefined);

    await toggleFullscreen();

    expect(isFullscreen.value).toBe(true);
    expect(mockRequestFullscreen).toHaveBeenCalled();
  });

  it("should toggle fullscreen correctly when in fullscreen", async () => {
    const { isFullscreen, toggleFullscreen } = useFullscreen();

    // Start in fullscreen
    document.fullscreenElement = document.documentElement;
    isFullscreen.value = true;

    mockExitFullscreen.mockResolvedValue(undefined);

    await toggleFullscreen();

    expect(isFullscreen.value).toBe(false);
    expect(mockExitFullscreen).toHaveBeenCalled();
  });
});
