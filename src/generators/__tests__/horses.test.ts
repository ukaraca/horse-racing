import { describe, expect, it } from "vitest";

import { CONDITION_MAX, CONDITION_MIN } from "@/shared/constants";

import { generateHorses } from "../horses";

describe("generateHorses", () => {
  it("should generate correct number of horses", () => {
    const horses = generateHorses();

    expect(horses).toHaveLength(20);
  });

  it("should generate horses with required properties", () => {
    const horses = generateHorses();

    horses.forEach((horse) => {
      expect(horse).toHaveProperty("id");
      expect(horse).toHaveProperty("name");
      expect(horse).toHaveProperty("color");
      expect(horse).toHaveProperty("baseCondition");

      expect(typeof horse.id).toBe("string");
      expect(typeof horse.name).toBe("string");
      expect(typeof horse.color).toBe("string");
      expect(typeof horse.baseCondition).toBe("number");
    });
  });

  it("should generate unique horse IDs", () => {
    const horses = generateHorses();
    const horseIds = horses.map((horse) => horse.id);
    const uniqueIds = new Set(horseIds);

    expect(uniqueIds.size).toBe(horses.length);
  });

  it("should generate horse IDs with correct format", () => {
    const horses = generateHorses();

    horses.forEach((horse) => {
      expect(horse.id).toMatch(/^H\d{2}$/);
    });
  });

  it("should generate horses with valid condition range", () => {
    const horses = generateHorses();

    horses.forEach((horse) => {
      expect(horse.baseCondition).toBeGreaterThanOrEqual(CONDITION_MIN);
      expect(horse.baseCondition).toBeLessThanOrEqual(CONDITION_MAX);
    });
  });

  it("should generate horses with valid color format", () => {
    const horses = generateHorses();

    horses.forEach((horse) => {
      expect(horse.color).toMatch(/^hsl\([\d.]+,\s*[\d.]+%,\s*[\d.]+%\)$/);
    });
  });

  it("should generate horses with non-empty names", () => {
    const horses = generateHorses();

    horses.forEach((horse) => {
      expect(horse.name.trim()).not.toBe("");
      expect(horse.name.length).toBeGreaterThan(0);
    });
  });
});
