import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TrophyIcon from "../TrophyIcon.vue";

describe("TrophyIcon", () => {
  it("renders correctly", () => {
    const wrapper = mount(TrophyIcon);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("has correct default size", () => {
    const wrapper = mount(TrophyIcon);

    expect(wrapper.find("svg").attributes("width")).toBe("16");
    expect(wrapper.find("svg").attributes("height")).toBe("16");
  });

  it("applies custom size", () => {
    const wrapper = mount(TrophyIcon, { props: { size: 24 } });

    expect(wrapper.find("svg").attributes("width")).toBe("24");
    expect(wrapper.find("svg").attributes("height")).toBe("24");
  });

  it("applies custom class", () => {
    const wrapper = mount(TrophyIcon, { props: { class: "custom-class" } });

    expect(wrapper.find("svg").classes()).toContain("custom-class");
  });

  it("has correct viewBox", () => {
    const wrapper = mount(TrophyIcon);

    expect(wrapper.find("svg").attributes("viewBox")).toBe("0 0 24 24");
  });

  it("has correct fill attribute", () => {
    const wrapper = mount(TrophyIcon);

    expect(wrapper.find("svg").attributes("fill")).toBe("currentColor");
  });

  it("has trophy path element", () => {
    const wrapper = mount(TrophyIcon);

    expect(wrapper.find("path").exists()).toBe(true);
    expect(wrapper.find("path").attributes("d")).toContain("M12 2l3.09 6.26L22 9.27l-5 4.87");
  });

  it("handles multiple props", () => {
    const wrapper = mount(TrophyIcon, {
      props: {
        size: 32,
        class: "large-trophy",
      },
    });

    expect(wrapper.find("svg").attributes("width")).toBe("32");
    expect(wrapper.find("svg").attributes("height")).toBe("32");
    expect(wrapper.find("svg").classes()).toContain("large-trophy");
  });
});
