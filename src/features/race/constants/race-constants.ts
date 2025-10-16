// Race Page Constants
export const PX_PER_METER = 2;
export const V_PARALLAX = 150;
export const DELTA_MIN = -2;
export const DELTA_MAX = 2;
export const DELTA_AFFINITY_SCALE = 0.5;

export const RACE_TICK_MS = 100;
export const FINALIZE_DELAY_MS = 2000;
export const SECTION_A_RATIO = 1 / 3;
export const SECTION_C_RATIO = 1 / 3;

export const TRACK_CONFIG = {
  lanes: 10,
  minLane: 30,
  maxLane: 80,
  skyColor: "#87CEEB",
};

export const TRACK_COLORS = {
  turf: { ground: "#2d5016", groundAlt: "#3a6a1f", mountain: "#4a6741" },
  dirt: { ground: "#8B7355", groundAlt: "#a08870", mountain: "#6d5d4a" },
  hybrid: { ground: "#5d7a3a", groundAlt: "#708a4d", mountain: "#5a6a51" },
} as const;

export type TPhase = "SCROLL" | "RUNOUT";
