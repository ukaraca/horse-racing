import { config } from "@vue/test-utils";
import { vi } from "vitest";

// Mock Vuex store
const mockStore = {
  state: {},
  getters: {},
  commit: vi.fn(),
  dispatch: vi.fn(),
};

// Mock Vue Router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

// Global mocks
config.global.mocks = {
  $store: mockStore,
  $router: mockRouter,
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock performance.now
Object.defineProperty(window, "performance", {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
  },
});

// Mock requestAnimationFrame
Object.defineProperty(window, "requestAnimationFrame", {
  writable: true,
  value: vi.fn((cb) => setTimeout(cb, 16)),
});

Object.defineProperty(window, "cancelAnimationFrame", {
  writable: true,
  value: vi.fn(),
});
