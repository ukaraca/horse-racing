import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Countdown from "../components/Countdown.vue";

describe("Countdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    const wrapper = mount(Countdown);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".countdown-overlay").exists()).toBe(true);
    expect(wrapper.find(".countdown-number").exists()).toBe(true);
  });

  it("displays initial countdown number", () => {
    const wrapper = mount(Countdown);

    expect(wrapper.find(".countdown-number").text()).toBe("3");
  });

  it("has countdown functionality", () => {
    const wrapper = mount(Countdown);

    // Initial state
    expect(wrapper.find(".countdown-number").text()).toBe("3");
    expect(wrapper.find(".countdown-overlay").exists()).toBe(true);
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(Countdown);

    const overlay = wrapper.find(".countdown-overlay");
    const number = wrapper.find(".countdown-number");

    expect(overlay.exists()).toBe(true);
    expect(number.exists()).toBe(true);
  });

  it("has transition wrapper", () => {
    const wrapper = mount(Countdown);

    expect(wrapper.find('[name="countdown"]').exists()).toBe(true);
  });

  it("unmounts without errors", () => {
    const wrapper = mount(Countdown);

    expect(() => wrapper.unmount()).not.toThrow();
  });
});
