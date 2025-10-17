import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Button from "../Button.vue";

describe("Button", () => {
  it("renders correctly", () => {
    const wrapper = mount(Button, {
      slots: {
        default: "Test Button",
      },
    });

    expect(wrapper.text()).toBe("Test Button");
    expect(wrapper.classes()).toContain("base-button");
  });

  it("applies correct variant classes", () => {
    const primaryWrapper = mount(Button, {
      props: { variant: "primary" },
      slots: { default: "Primary" },
    });

    const secondaryWrapper = mount(Button, {
      props: { variant: "secondary" },
      slots: { default: "Secondary" },
    });

    expect(primaryWrapper.classes()).toContain("base-button--primary");
    expect(secondaryWrapper.classes()).toContain("base-button--secondary");
  });

  it("applies correct size classes", () => {
    const smWrapper = mount(Button, {
      props: { size: "sm" },
      slots: { default: "Small" },
    });

    const lgWrapper = mount(Button, {
      props: { size: "lg" },
      slots: { default: "Large" },
    });

    expect(smWrapper.classes()).toContain("base-button--sm");
    expect(lgWrapper.classes()).toContain("base-button--lg");
  });

  it("handles disabled state", () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: "Disabled" },
    });

    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.classes()).toContain("base-button--disabled");
  });

  it("emits click events", async () => {
    const wrapper = mount(Button, {
      slots: { default: "Clickable" },
    });

    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });
});
