import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PageContainer from "../PageContainer.vue";

describe("PageContainer", () => {
  it("renders correctly", () => {
    const wrapper = mount(PageContainer, {
      slots: { default: "Page content" },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Page content");
  });

  it("applies correct base classes", () => {
    const wrapper = mount(PageContainer);

    expect(wrapper.find(".page-container").exists()).toBe(true);
    expect(wrapper.find(".container").exists()).toBe(true);
  });

  it("applies gradient class by default", () => {
    const wrapper = mount(PageContainer);

    expect(wrapper.find(".page-container").classes()).toContain("page-container--gradient");
  });

  it("applies gradient class when gradient prop is true", () => {
    const wrapper = mount(PageContainer, { props: { gradient: true } });

    expect(wrapper.find(".page-container").classes()).toContain("page-container--gradient");
  });

  it("does not apply gradient class when gradient prop is false", () => {
    const wrapper = mount(PageContainer, { props: { gradient: false } });

    expect(wrapper.find(".page-container").classes()).not.toContain("page-container--gradient");
  });

  it("renders slot content", () => {
    const wrapper = mount(PageContainer, {
      slots: {
        default: "<div class='custom-content'>Custom content</div>",
      },
    });

    expect(wrapper.find(".custom-content").exists()).toBe(true);
    expect(wrapper.find(".custom-content").text()).toBe("Custom content");
  });

  it("has proper structure", () => {
    const wrapper = mount(PageContainer);

    const pageContainer = wrapper.find(".page-container");
    const container = wrapper.find(".container");

    expect(pageContainer.exists()).toBe(true);
    expect(container.exists()).toBe(true);
    expect(container.element.parentElement).toBe(pageContainer.element);
  });
});
