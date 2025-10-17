import { describe, expect, it } from "vitest";

import { generateUniqueColors } from "../colors";

describe("generateUniqueColors", () => {
  it("should generate correct number of colors", () => {
    const colors = generateUniqueColors(5);

    expect(colors).toHaveLength(5);
  });

  it("should generate valid HSL colors", () => {
    const colors = generateUniqueColors(3);

    colors.forEach((color) => {
      expect(color).toMatch(/^hsl\([\d.]+,\s*[\d.]+%,\s*[\d.]+%\)$/);
    });
  });

  it("should generate different colors", () => {
    const colors = generateUniqueColors(10);
    const uniqueColors = new Set(colors);

    expect(uniqueColors.size).toBe(10);
  });

  it("should handle edge cases", () => {
    expect(() => generateUniqueColors(0)).not.toThrow();
    expect(() => generateUniqueColors(1)).not.toThrow();
    expect(() => generateUniqueColors(100)).not.toThrow();
  });
});
