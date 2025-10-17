import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Modal from "../Modal.vue";

describe("Modal", () => {
  it("renders when modelValue is true", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
      slots: { default: "Modal content" },
    });

    expect(wrapper.find(".modal-overlay").exists()).toBe(true);
    expect(wrapper.find(".modal-content").exists()).toBe(true);
    expect(wrapper.text()).toContain("Modal content");
  });

  it("does not render when modelValue is false", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: false },
      slots: { default: "Modal content" },
    });

    expect(wrapper.find(".modal-overlay").exists()).toBe(false);
  });

  it("displays title when provided", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, title: "Test Modal" },
    });

    expect(wrapper.find(".modal-header").exists()).toBe(true);
    expect(wrapper.find(".modal-title").text()).toBe("Test Modal");
  });

  it("does not display header when title is not provided", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
    });

    expect(wrapper.find(".modal-header").exists()).toBe(false);
  });

  it("displays close button when title is provided", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, title: "Test Modal" },
    });

    expect(wrapper.find(".close-btn").exists()).toBe(true);
  });

  it("does not display close button when title is not provided", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
    });

    expect(wrapper.find(".close-btn").exists()).toBe(false);
  });

  it("emits update:modelValue when close button is clicked", async () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, title: "Test Modal" },
    });

    await wrapper.find(".close-btn").trigger("click");

    expect(wrapper.emitted()["update:modelValue"]).toHaveLength(1);
    expect(wrapper.emitted()["update:modelValue"][0][0]).toBe(false);
  });

  it("emits update:modelValue when backdrop is clicked", async () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
    });

    await wrapper.find(".modal-overlay").trigger("click");

    expect(wrapper.emitted()["update:modelValue"]).toHaveLength(1);
    expect(wrapper.emitted()["update:modelValue"][0][0]).toBe(false);
  });

  it("does not emit update:modelValue when modal content is clicked", async () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
    });

    await wrapper.find(".modal-content").trigger("click");

    expect(wrapper.emitted()["update:modelValue"]).toBeUndefined();
  });

  it("renders slot content in modal body", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
      slots: {
        default: "<div class='custom-content'>Custom content</div>",
      },
    });

    expect(wrapper.find(".modal-body").exists()).toBe(true);
    expect(wrapper.find(".custom-content").exists()).toBe(true);
    expect(wrapper.find(".custom-content").text()).toBe("Custom content");
  });

  it("has transition wrapper", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
    });

    expect(wrapper.find('[name="modal"]').exists()).toBe(true);
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, title: "Test Modal" },
    });

    expect(wrapper.find(".modal-overlay").exists()).toBe(true);
    expect(wrapper.find(".modal-container").exists()).toBe(true);
    expect(wrapper.find(".modal-content").exists()).toBe(true);
    expect(wrapper.find(".modal-header").exists()).toBe(true);
    expect(wrapper.find(".modal-body").exists()).toBe(true);
  });
});
