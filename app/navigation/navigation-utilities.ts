// navigation-utilities.ts
import {useEffect, useRef, useState} from 'react';
import {BackHandler, Platform} from 'react-native';
import {
  NavigationState,
  PartialState,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {NavigatorParamList} from './types/route-params';

// Type-safe navigation reference
export const navigationRef = createNavigationContainerRef<NavigatorParamList>();

/**
 * Gets the current screen from any navigation state.
 */
export function getActiveRouteName(
  state: NavigationState | PartialState<NavigationState>,
): string {
  const route = state.routes[state.index ?? 0];

  // Found the active route -- return the name
  if (!route.state) {
    return route.name;
  }

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state);
}

/**
 * Get the current route name from navigation state
 * @returns The current route name or null if navigation is not ready
 */
export const getCurrentRouteName = (): string | null => {
  if (!navigationRef.isReady()) {
    return null;
  }

  // Get current route
  const route = navigationRef.getCurrentRoute();
  return route?.name || null;
};

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 */
export function useBackButtonHandler(canExit: (routeName: string) => boolean) {
  const canExitRef = useRef(canExit);

  useEffect(() => {
    canExitRef.current = canExit;
  }, [canExit]);

  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return false;
      }

      // grab the current route
      const routeName = getActiveRouteName(navigationRef.getRootState());

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // let the system know we've not handled this event
        return false;
      }

      // we can't exit, so let's turn this into a back action
      if (navigationRef.canGoBack()) {
        navigationRef.goBack();
        return true;
      }

      return false;
    };

    // Only add listener on Android
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
    // Return empty function for non-Android platforms
    return () => {}; // Add this line to fix the issue
  }, []);
}

/**
 * Custom hook for persisting navigation state.
 */
export function useNavigationPersistence(storage: any, persistenceKey: string) {
  const [initialNavigationState, setInitialNavigationState] = useState();
  const [isRestored, setIsRestored] = useState(!__DEV__);

  const onNavigationStateChange = (state: NavigationState) => {
    // Save the current route name for later comparison
    const currentRouteName = getActiveRouteName(state);

    // Persist state to storage
    storage.save(persistenceKey, state);

    // Log for debugging in development
    if (__DEV__) {
      console.log('NAVIGATION:', currentRouteName);
    }
  };

  const restoreState = async () => {
    try {
      const state = await storage.load(persistenceKey);
      if (state) {
        setInitialNavigationState(state);
      }
    } finally {
      setIsRestored(true);
    }
  };

  useEffect(() => {
    if (!isRestored) {
      restoreState();
    }
  }, [isRestored]);

  return {
    onNavigationStateChange,
    restoreState,
    isRestored,
    initialNavigationState,
  };
}

/**
 * Type-safe navigation helpers
 */
/**
 * Type-safe navigation helpers
 */
export function navigate<T extends keyof NavigatorParamList>(
  name: T,
  params?: NavigatorParamList[T],
) {
  if (navigationRef.isReady()) {
    // Fix: Cast the navigationRef to any before calling navigate
    // This avoids the TypeScript error while still preserving type checking on our parameters
    (navigationRef as any).navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function resetRoot(params = {index: 0, routes: []}) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(params);
  }
}
