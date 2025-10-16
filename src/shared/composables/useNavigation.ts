import { useRouter } from "vue-router";
import { ROUTE_NAMES, ROUTE_PATHS, type RouteName, type RoutePath } from "@/app/router/routes";

/**
 * Composable for type-safe navigation
 */
export function useNavigation() {
  const router = useRouter();

  /**
   * Navigate to a route by name
   */
  const navigateTo = (routeName: RouteName) => {
    return router.push({ name: routeName });
  };

  /**
   * Navigate to a route by path
   */
  const navigateToPath = (path: RoutePath) => {
    return router.push(path);
  };

  /**
   * Navigate back
   */
  const goBack = () => {
    return router.back();
  };

  /**
   * Navigate forward
   */
  const goForward = () => {
    return router.forward();
  };

  /**
   * Replace current route
   */
  const replaceRoute = (routeName: RouteName) => {
    return router.replace({ name: routeName });
  };

  /**
   * Replace current route with path
   */
  const replaceRoutePath = (path: RoutePath) => {
    return router.replace(path);
  };

  return {
    navigateTo,
    navigateToPath,
    goBack,
    goForward,
    replaceRoute,
    replaceRoutePath,
    // Export route constants for convenience
    ROUTE_NAMES,
    ROUTE_PATHS,
  };
}
