import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Card from "../Card.vue";

describe("Card", () => {
  it("renders correctly", () => {
    const wrapper = mount(Card, { slots: { default: "Test Content" } });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Test Content");
  });

  it("applies correct base classes", () => {
    const wrapper = mount(Card);

    expect(wrapper.classes()).toContain("base-card");
    expect(wrapper.classes()).toContain("base-card--md"); // default padding
  });

  it("applies correct padding classes", () => {
    const wrapperSm = mount(Card, { props: { padding: "sm" } });
    expect(wrapperSm.classes()).toContain("base-card--sm");

    const wrapperMd = mount(Card, { props: { padding: "md" } });
    expect(wrapperMd.classes()).toContain("base-card--md");

    const wrapperLg = mount(Card, { props: { padding: "lg" } });
    expect(wrapperLg.classes()).toContain("base-card--lg");
  });

  it("applies hoverable class when hoverable is true", () => {
    const wrapper = mount(Card, { props: { hoverable: true } });

    expect(wrapper.classes()).toContain("base-card--hoverable");
  });

  it("does not apply hoverable class when hoverable is false", () => {
    const wrapper = mount(Card, { props: { hoverable: false } });

    expect(wrapper.classes()).not.toContain("base-card--hoverable");
  });

  it("renders slot content", () => {
    const wrapper = mount(Card, {
      slots: {
        default: "<span>Custom content</span>",
      },
    });

    expect(wrapper.find("span").exists()).toBe(true);
    expect(wrapper.find("span").text()).toBe("Custom content");
  });

  it("handles multiple props correctly", () => {
    const wrapper = mount(Card, {
      props: {
        padding: "lg",
        hoverable: true,
      },
    });

    expect(wrapper.classes()).toContain("base-card");
    expect(wrapper.classes()).toContain("base-card--lg");
    expect(wrapper.classes()).toContain("base-card--hoverable");
  });
});
