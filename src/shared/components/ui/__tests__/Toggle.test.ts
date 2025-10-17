import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Toggle from "../Toggle.vue";

describe("Toggle", () => {
  it("renders correctly", () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: false },
    });

    expect(wrapper.classes()).toContain("base-toggle");
    expect(wrapper.find(".toggle-switch").exists()).toBe(true);
  });

  it("displays label when provided", () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: false, label: "Test Label" },
    });

    expect(wrapper.text()).toContain("Test Label");
    expect(wrapper.find(".toggle-label").exists()).toBe(true);
  });

  it("applies active class when modelValue is true", () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: true },
    });

    expect(wrapper.find(".toggle-switch").classes()).toContain("toggle-switch--active");
  });

  it("emits update:modelValue when clicked", async () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: false },
    });

    await wrapper.find(".toggle-switch").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);
  });

  it("toggles value correctly", async () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: false },
    });

    // Click to turn on
    await wrapper.find(".toggle-switch").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);

    // Reset and click to turn off
    await wrapper.setProps({ modelValue: true });
    await wrapper.find(".toggle-switch").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([false]);
  });

  it("handles disabled state", () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: false, disabled: true },
    });

    const switchElement = wrapper.find(".toggle-switch");
    expect(switchElement.attributes("disabled")).toBeDefined();
    expect(switchElement.classes()).toContain("toggle-switch--disabled");
  });
});
