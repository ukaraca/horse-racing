export const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200] as const;
export type TRoundDistance = (typeof ROUND_DISTANCES)[number];

export const SURFACES = ["turf", "dirt", "hybrid"] as const;
export type TSurface = (typeof SURFACES)[number];

export const HORSE_COUNT_TOTAL = 20;
export const HORSES_PER_ROUND = 10;

export const CONDITION_MIN = 60;
export const CONDITION_MAX = 100;

export const TRACK_CONDITION_MULTIPLIER: Record<string, Record<string, number>> = {
  dirt: { fast: 1.0, good: 0.99, wet: 0.97, muddy: 0.95 },
  turf: { firm: 1.0, good: 0.99, soft: 0.96, heavy: 0.94 },
  hybrid: { standard: 1.0, fast: 1.0, wet: 0.98 },
};

export * from "./audio";
