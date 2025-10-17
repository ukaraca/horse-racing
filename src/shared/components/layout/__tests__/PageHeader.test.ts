import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PageHeader from "../PageHeader.vue";

describe("PageHeader", () => {
  it("renders correctly with title", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page" },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".page-title").text()).toBe("Test Page");
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page" },
    });

    expect(wrapper.find(".page-header").exists()).toBe(true);
    expect(wrapper.find(".page-title").exists()).toBe(true);
  });

  it("displays count when provided", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page", count: 5 },
    });

    expect(wrapper.find(".page-count").exists()).toBe(true);
    expect(wrapper.find(".count-number").text()).toBe("5");
  });

  it("does not display count when not provided", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page" },
    });

    expect(wrapper.find(".page-count").exists()).toBe(false);
  });

  it("uses default count label when not provided", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page", count: 3 },
    });

    expect(wrapper.find(".count-label").text()).toBe("Items");
  });

  it("uses custom count label when provided", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page", count: 3, countLabel: "Horses" },
    });

    expect(wrapper.find(".count-label").text()).toBe("Horses");
  });

  it("handles zero count", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page", count: 0 },
    });

    expect(wrapper.find(".page-count").exists()).toBe(true);
    expect(wrapper.find(".count-number").text()).toBe("0");
  });

  it("handles large count numbers", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page", count: 999 },
    });

    expect(wrapper.find(".count-number").text()).toBe("999");
  });

  it("has proper structure with count", () => {
    const wrapper = mount(PageHeader, {
      props: { title: "Test Page", count: 5, countLabel: "Items" },
    });

    const header = wrapper.find(".page-header");
    const title = wrapper.find(".page-title");
    const count = wrapper.find(".page-count");
    const countNumber = wrapper.find(".count-number");
    const countLabel = wrapper.find(".count-label");

    expect(header.exists()).toBe(true);
    expect(title.exists()).toBe(true);
    expect(count.exists()).toBe(true);
    expect(countNumber.exists()).toBe(true);
    expect(countLabel.exists()).toBe(true);

    expect(countNumber.element.parentElement).toBe(count.element);
    expect(countLabel.element.parentElement).toBe(count.element);
  });
});
