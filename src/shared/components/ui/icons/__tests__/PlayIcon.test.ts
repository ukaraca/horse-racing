import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PlayIcon from "../PlayIcon.vue";

describe("PlayIcon", () => {
  it("renders correctly", () => {
    const wrapper = mount(PlayIcon);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("has correct default size", () => {
    const wrapper = mount(PlayIcon);

    expect(wrapper.find("svg").attributes("width")).toBe("16");
    expect(wrapper.find("svg").attributes("height")).toBe("16");
  });

  it("applies custom size", () => {
    const wrapper = mount(PlayIcon, { props: { size: 24 } });

    expect(wrapper.find("svg").attributes("width")).toBe("24");
    expect(wrapper.find("svg").attributes("height")).toBe("24");
  });

  it("applies custom class", () => {
    const wrapper = mount(PlayIcon, { props: { class: "custom-class" } });

    expect(wrapper.find("svg").classes()).toContain("custom-class");
  });

  it("has correct viewBox", () => {
    const wrapper = mount(PlayIcon);

    expect(wrapper.find("svg").attributes("viewBox")).toBe("0 0 24 24");
  });

  it("has correct fill attribute", () => {
    const wrapper = mount(PlayIcon);

    expect(wrapper.find("svg").attributes("fill")).toBe("currentColor");
  });

  it("does not have pixel art styling", () => {
    const wrapper = mount(PlayIcon);

    const style = wrapper.find("svg").attributes("style");
    expect(style).toBeUndefined();
  });

  it("has play triangle polygon", () => {
    const wrapper = mount(PlayIcon);

    expect(wrapper.find("polygon").exists()).toBe(true);
    expect(wrapper.find("polygon").attributes("points")).toBe("5 3 19 12 5 21 5 3");
  });

  it("does not have pixel art comment", () => {
    const wrapper = mount(PlayIcon);

    expect(wrapper.html()).not.toContain("<!-- Play triangle - pixel perfect -->");
  });

  it("handles multiple props", () => {
    const wrapper = mount(PlayIcon, {
      props: {
        size: 32,
        class: "large-play",
      },
    });

    expect(wrapper.find("svg").classes()).toContain("large-play");
  });
});
