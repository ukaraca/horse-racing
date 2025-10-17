import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PauseIcon from "../PauseIcon.vue";

describe("PauseIcon", () => {
  it("renders correctly", () => {
    const wrapper = mount(PauseIcon);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("has correct default size", () => {
    const wrapper = mount(PauseIcon);

    expect(wrapper.find("svg").attributes("width")).toBe("16");
    expect(wrapper.find("svg").attributes("height")).toBe("16");
  });

  it("applies custom size", () => {
    const wrapper = mount(PauseIcon, { props: { size: 24 } });

    expect(wrapper.find("svg").attributes("width")).toBe("16"); // Width is hardcoded to 16
    expect(wrapper.find("svg").attributes("height")).toBe("16"); // Height is hardcoded to 16
  });

  it("applies custom class", () => {
    const wrapper = mount(PauseIcon, { props: { class: "custom-class" } });

    expect(wrapper.find("svg").classes()).toContain("custom-class");
  });

  it("has correct viewBox", () => {
    const wrapper = mount(PauseIcon);

    expect(wrapper.find("svg").attributes("viewBox")).toBe("0 0 16 16");
  });

  it("has correct fill attribute", () => {
    const wrapper = mount(PauseIcon);

    expect(wrapper.find("svg").attributes("fill")).toBe("none");
  });

  it("does not have pixel art styling", () => {
    const wrapper = mount(PauseIcon);

    const style = wrapper.find("svg").attributes("style");
    expect(style).toBeUndefined();
  });

  it("has pause bar rectangles", () => {
    const wrapper = mount(PauseIcon);

    const rects = wrapper.findAll("rect");
    expect(rects).toHaveLength(2);

    // First pause bar
    expect(rects[0].attributes("x")).toBe("3");
    expect(rects[0].attributes("y")).toBe("2");
    expect(rects[0].attributes("width")).toBe("3");
    expect(rects[0].attributes("height")).toBe("12");

    // Second pause bar
    expect(rects[1].attributes("x")).toBe("10");
    expect(rects[1].attributes("y")).toBe("2");
    expect(rects[1].attributes("width")).toBe("3");
    expect(rects[1].attributes("height")).toBe("12");
  });

  it("does not have pixel art comment", () => {
    const wrapper = mount(PauseIcon);

    expect(wrapper.html()).not.toContain("<!-- Pause bars - pixel perfect -->");
  });

  it("handles multiple props", () => {
    const wrapper = mount(PauseIcon, {
      props: {
        size: 32,
        class: "large-pause",
      },
    });

    expect(wrapper.find("svg").classes()).toContain("large-pause");
  });
});
