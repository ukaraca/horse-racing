import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import RaceHud from "../components/RaceHud.vue";
import type { HudRenderData } from "../utils/RacePageRenderer";

describe("RaceHud", () => {
  const createMockHudData = (overrides: Partial<HudRenderData> = {}): HudRenderData => ({
    isVisible: true,
    isCountdownComplete: true,
    hudInfo: {
      round: 1,
      trackLabel: "Test Track",
      distance: 1200,
    },
    progressBar: {
      isVisible: true,
      progress: 50,
    },
    standings: [
      {
        horseId: "H01",
        position: 1,
        name: "Test Horse 1",
        color: "#ff0000",
        isPodium: true,
      },
      {
        horseId: "H02",
        position: 2,
        name: "Test Horse 2",
        color: "#00ff00",
        isPodium: true,
      },
    ],
    ...overrides,
  });

  it("renders correctly when visible", () => {
    const hudData = createMockHudData();
    const wrapper = mount(RaceHud, {
      props: { hudData },
    });

    expect(wrapper.find(".race-hud").exists()).toBe(true);
    expect(wrapper.text()).toContain("Round 1");
    expect(wrapper.text()).toContain("Test Track");
    expect(wrapper.text()).toContain("1200m");
  });

  it("does not render when not visible", () => {
    const hudData = createMockHudData({ isVisible: false });
    const wrapper = mount(RaceHud, {
      props: { hudData },
    });

    expect(wrapper.find(".race-hud").exists()).toBe(false);
  });

  it("displays progress bar when visible", () => {
    const hudData = createMockHudData();
    const wrapper = mount(RaceHud, {
      props: { hudData },
    });

    const progressBar = wrapper.find(".hud-progress-bar");
    expect(progressBar.exists()).toBe(true);

    const progressFill = wrapper.find(".hud-progress-fill");
    expect(progressFill.exists()).toBe(true);
    expect(progressFill.attributes("style")).toContain("width: 50%");
  });

  it("hides progress bar when not visible", () => {
    const hudData = createMockHudData({
      progressBar: { isVisible: false, progress: 50 },
    });
    const wrapper = mount(RaceHud, {
      props: { hudData },
    });

    expect(wrapper.find(".hud-progress-bar").exists()).toBe(false);
  });

  it("displays standings when countdown is complete", () => {
    const hudData = createMockHudData();
    const wrapper = mount(RaceHud, {
      props: { hudData },
    });

    const standings = wrapper.find(".hud-standings");
    expect(standings.exists()).toBe(true);

    const standingChips = wrapper.findAll(".standing-chip");
    expect(standingChips).toHaveLength(2);

    // Check first horse
    const firstChip = standingChips[0];
    expect(firstChip.text()).toContain("1");
    expect(firstChip.classes()).toContain("standing-chip--podium");

    // Check second horse
    const secondChip = standingChips[1];
    expect(secondChip.text()).toContain("2");
    expect(secondChip.classes()).toContain("standing-chip--podium");
  });

  it("hides standings when countdown is not complete", () => {
    const hudData = createMockHudData({ isCountdownComplete: false });
    const wrapper = mount(RaceHud, {
      props: { hudData },
    });

    expect(wrapper.find(".hud-standings").exists()).toBe(false);
  });

  it("displays horse colors correctly", () => {
    const hudData = createMockHudData();
    const wrapper = mount(RaceHud, {
      props: { hudData },
    });

    const standingColors = wrapper.findAll(".standing-color");
    expect(standingColors).toHaveLength(2);

    expect(standingColors[0].attributes("style")).toContain("background-color: rgb(255, 0, 0)");
    expect(standingColors[1].attributes("style")).toContain("background-color: rgb(0, 255, 0)");
  });

  it("handles empty standings", () => {
    const hudData = createMockHudData({ standings: [] });
    const wrapper = mount(RaceHud, {
      props: { hudData },
    });

    const standings = wrapper.find(".hud-standings");
    expect(standings.exists()).toBe(true);
    expect(wrapper.findAll(".standing-chip")).toHaveLength(0);
  });
});
