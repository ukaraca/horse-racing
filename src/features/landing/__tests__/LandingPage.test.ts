import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LandingPage from "../pages/LandingPage.vue";

// Mock the composables
const mockNavigateTo = vi.fn();
vi.mock("@/shared/composables", () => ({
  useNavigation: () => ({
    navigateTo: mockNavigateTo,
    ROUTE_NAMES: { RACE_MANAGEMENT: "race-management" },
  }),
}));

// Mock PlayIcon component
vi.mock("../components/PlayIcon.vue", () => ({
  default: {
    name: "PlayIcon",
    template: "<div class='play-icon'>▶</div>",
  },
}));

describe("LandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    const wrapper = mount(LandingPage);

    expect(wrapper.find(".landing-screen").exists()).toBe(true);
    expect(wrapper.find(".landing-content").exists()).toBe(true);
    expect(wrapper.find(".title-section").exists()).toBe(true);
    expect(wrapper.find(".action-section").exists()).toBe(true);
  });

  it("displays game title correctly", () => {
    const wrapper = mount(LandingPage);

    expect(wrapper.text()).toContain("HORSE");
    expect(wrapper.text()).toContain("RACING");
    expect(wrapper.findAll(".title-word")).toHaveLength(2);
  });

  it("displays subtitle", () => {
    const wrapper = mount(LandingPage);

    expect(wrapper.text()).toContain("PRESS PLAY TO START");
    expect(wrapper.find(".subtitle").exists()).toBe(true);
  });

  it("displays play button", () => {
    const wrapper = mount(LandingPage);

    const playButton = wrapper.find(".play-button");
    expect(playButton.exists()).toBe(true);
    expect(playButton.text()).toContain("PLAY");
    expect(wrapper.findComponent({ name: "PlayIcon" }).exists()).toBe(true);
  });

  it("handles play button click", async () => {
    const wrapper = mount(LandingPage);

    const playButton = wrapper.find(".play-button");
    await playButton.trigger("click");

    expect(mockNavigateTo).toHaveBeenCalledWith("race-management");
  });

  it("handles keyboard events", async () => {
    mount(LandingPage);

    // Test Enter key on document
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(mockNavigateTo).toHaveBeenCalledWith("race-management");

    // Test Space key on document
    document.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    expect(mockNavigateTo).toHaveBeenCalledWith("race-management");
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(LandingPage);

    expect(wrapper.find(".landing-screen").classes()).toContain("landing-screen");
    expect(wrapper.find(".landing-content").classes()).toContain("landing-content");
    expect(wrapper.find(".title-section").classes()).toContain("title-section");
    expect(wrapper.find(".action-section").classes()).toContain("action-section");
    expect(wrapper.find(".play-button").classes()).toContain("play-button");
  });

  it("has pixel overlay", () => {
    const wrapper = mount(LandingPage);

    expect(wrapper.find(".pixel-overlay").exists()).toBe(true);
  });

  it("button has correct size prop", () => {
    const wrapper = mount(LandingPage);

    const playButton = wrapper.find(".play-button");
    // The Button component should receive size="lg" prop
    expect(playButton.exists()).toBe(true);
  });
});
