/**
 * Route names constants for type-safe navigation
 */
export const ROUTE_NAMES = {
  LANDING: "landing",
  RACE_MANAGEMENT: "race-management",
  RACE: "race",
} as const;

/**
 * Route paths constants
 */
export const ROUTE_PATHS = {
  LANDING: "/",
  RACE_MANAGEMENT: "/race-management",
  RACE: "/race",
} as const;

/**
 * Type for route names
 */
export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];

/**
 * Type for route paths
 */
export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
