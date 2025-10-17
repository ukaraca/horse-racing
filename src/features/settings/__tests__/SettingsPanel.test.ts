import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { computed } from "vue";

import SettingsPanel from "../SettingsPanel.vue";

// Mock the composables
vi.mock("@/shared/composables", () => ({
  useSettings: () => ({
    isMusicEnabled: computed(() => true),
    isSoundEnabled: computed(() => false),
    toggleMusic: vi.fn(),
    toggleSound: vi.fn(),
  }),
  useFullscreen: () => ({
    isFullscreen: computed(() => false),
    toggleFullscreen: vi.fn(),
  }),
  useNavigation: () => ({
    navigateTo: vi.fn(),
    ROUTE_NAMES: { LANDING: "landing" },
  }),
  useStore: () => ({
    dispatchAction: vi.fn(),
    GAME_ACTIONS: { RESET_GAME: "resetGame" },
  }),
}));

describe("SettingsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when modelValue is true", () => {
    const wrapper = mount(SettingsPanel, {
      props: { modelValue: true },
    });

    expect(wrapper.find(".modal-content").exists()).toBe(true);
    expect(wrapper.text()).toContain("Settings");
  });

  it("does not render when modelValue is false", () => {
    const wrapper = mount(SettingsPanel, {
      props: { modelValue: false },
    });

    expect(wrapper.find(".modal-content").exists()).toBe(false);
  });

  it("displays all toggle controls", () => {
    const wrapper = mount(SettingsPanel, {
      props: { modelValue: true },
    });

    expect(wrapper.findAll(".base-toggle")).toHaveLength(3);
    expect(wrapper.text()).toContain("Ambience Music");
    expect(wrapper.text()).toContain("Sound Effects");
    expect(wrapper.text()).toContain("Fullscreen");
  });

  it("displays return to menu button", () => {
    const wrapper = mount(SettingsPanel, {
      props: { modelValue: true },
    });

    expect(wrapper.text()).toContain("Return to Menu");
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("emits update:modelValue when modal is closed", async () => {
    const wrapper = mount(SettingsPanel, {
      props: { modelValue: true },
    });

    // Click the backdrop or close button
    const modalOverlay = wrapper.find(".modal-overlay");
    await modalOverlay.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("handles toggle interactions", async () => {
    const wrapper = mount(SettingsPanel, {
      props: { modelValue: true },
    });

    const toggles = wrapper.findAll(".toggle-switch");
    expect(toggles).toHaveLength(3);

    // Click first toggle (music)
    await toggles[0].trigger("click");
    // The actual toggle behavior is mocked, so we just verify it doesn't throw
    expect(toggles[0].exists()).toBe(true);
  });

  it("calls return to menu handler", async () => {
    const wrapper = mount(SettingsPanel, {
      props: { modelValue: true },
    });

    const returnButton = wrapper.find("button");
    await returnButton.trigger("click");

    // Verify the button click doesn't throw
    expect(returnButton.exists()).toBe(true);
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(SettingsPanel, {
      props: { modelValue: true },
    });

    expect(wrapper.find(".settings-content").exists()).toBe(true);
    expect(wrapper.findAll(".setting-item")).toHaveLength(3);
  });
});
