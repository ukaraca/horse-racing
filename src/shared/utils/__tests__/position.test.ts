import { describe, expect, it } from "vitest";

import {
  getFullPosition,
  getMedalEmoji,
  getPositionColor,
  getPositionSuffix,
  isPodiumPosition,
} from "../position";

describe("getPositionSuffix", () => {
  it("should return correct suffix for 1st place", () => {
    expect(getPositionSuffix(1)).toBe("st");
  });

  it("should return correct suffix for 2nd place", () => {
    expect(getPositionSuffix(2)).toBe("nd");
  });

  it("should return correct suffix for 3rd place", () => {
    expect(getPositionSuffix(3)).toBe("rd");
  });

  it("should return th for other positions", () => {
    expect(getPositionSuffix(4)).toBe("th");
    expect(getPositionSuffix(10)).toBe("th");
    expect(getPositionSuffix(21)).toBe("th");
  });
});

describe("getFullPosition", () => {
  it("should return full position string", () => {
    expect(getFullPosition(1)).toBe("1st");
    expect(getFullPosition(2)).toBe("2nd");
    expect(getFullPosition(3)).toBe("3rd");
    expect(getFullPosition(4)).toBe("4th");
    expect(getFullPosition(10)).toBe("10th");
  });
});

describe("getPositionColor", () => {
  it("should return gold color for 1st place", () => {
    expect(getPositionColor(1)).toContain("gold");
  });

  it("should return silver color for 2nd place", () => {
    expect(getPositionColor(2)).toContain("silver");
  });

  it("should return bronze color for 3rd place", () => {
    expect(getPositionColor(3)).toContain("bronze");
  });

  it("should return secondary color for other positions", () => {
    expect(getPositionColor(4)).toContain("secondary");
    expect(getPositionColor(10)).toContain("secondary");
  });
});

describe("isPodiumPosition", () => {
  it("should return true for podium positions", () => {
    expect(isPodiumPosition(1)).toBe(true);
    expect(isPodiumPosition(2)).toBe(true);
    expect(isPodiumPosition(3)).toBe(true);
  });

  it("should return false for non-podium positions", () => {
    expect(isPodiumPosition(4)).toBe(false);
    expect(isPodiumPosition(10)).toBe(false);
    expect(isPodiumPosition(0)).toBe(false);
  });
});

describe("getMedalEmoji", () => {
  it("should return correct medal emojis", () => {
    expect(getMedalEmoji(1)).toBe("🏆");
    expect(getMedalEmoji(2)).toBe("🥈");
    expect(getMedalEmoji(3)).toBe("🥉");
    expect(getMedalEmoji(4)).toBe("");
    expect(getMedalEmoji(10)).toBe("");
  });
});
