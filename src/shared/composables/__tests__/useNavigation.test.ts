import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Router } from "vue-router";

import { useNavigation } from "../useNavigation";

// Mock Vue Router
const mockRouter: Partial<Router> = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => mockRouter),
}));

// Mock routes
vi.mock("@/app/router/routes", () => ({
  ROUTE_NAMES: {
    LANDING: "landing",
    RACE_MANAGEMENT: "race-management",
    RACE: "race",
  },
  ROUTE_PATHS: {
    LANDING: "/",
    RACE_MANAGEMENT: "/race-management",
    RACE: "/race",
  },
}));

describe("useNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide navigation methods and constants", () => {
    const {
      navigateTo,
      navigateToPath,
      goBack,
      goForward,
      replaceRoute,
      replaceRoutePath,
      ROUTE_NAMES,
      ROUTE_PATHS,
    } = useNavigation();

    expect(typeof navigateTo).toBe("function");
    expect(typeof navigateToPath).toBe("function");
    expect(typeof goBack).toBe("function");
    expect(typeof goForward).toBe("function");
    expect(typeof replaceRoute).toBe("function");
    expect(typeof replaceRoutePath).toBe("function");

    expect(ROUTE_NAMES).toBeDefined();
    expect(ROUTE_PATHS).toBeDefined();
  });

  it("should navigate to route by name", () => {
    const { navigateTo } = useNavigation();

    navigateTo("landing");

    expect(mockRouter.push).toHaveBeenCalledWith({ name: "landing" });
  });

  it("should navigate to route by path", () => {
    const { navigateToPath } = useNavigation();

    navigateToPath("/race-management");

    expect(mockRouter.push).toHaveBeenCalledWith("/race-management");
  });

  it("should go back", () => {
    const { goBack } = useNavigation();

    goBack();

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("should go forward", () => {
    const { goForward } = useNavigation();

    goForward();

    expect(mockRouter.forward).toHaveBeenCalled();
  });

  it("should replace route by name", () => {
    const { replaceRoute } = useNavigation();

    replaceRoute("race");

    expect(mockRouter.replace).toHaveBeenCalledWith({ name: "race" });
  });

  it("should replace route by path", () => {
    const { replaceRoutePath } = useNavigation();

    replaceRoutePath("/race");

    expect(mockRouter.replace).toHaveBeenCalledWith("/race");
  });

  it("should return route constants", () => {
    const { ROUTE_NAMES, ROUTE_PATHS } = useNavigation();

    expect(ROUTE_NAMES).toEqual({
      LANDING: "landing",
      RACE_MANAGEMENT: "race-management",
      RACE: "race",
    });

    expect(ROUTE_PATHS).toEqual({
      LANDING: "/",
      RACE_MANAGEMENT: "/race-management",
      RACE: "/race",
    });
  });
});
