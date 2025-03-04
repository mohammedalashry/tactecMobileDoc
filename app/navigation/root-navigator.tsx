// navigation/root-navigator.tsx
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import * as storage from '@app/utils/storage';
import {RootState} from 'redux/store';
import {navigationRef, useNavigationPersistence} from './navigation-utilities';
import {logNavigationStatus} from './navigationDebug';
import {AuthNavigator} from './auth/auth-navigator';
import IntroApp from 'screens/IntroApp';
import {UserRole} from './types/navigator-types';

// Create the root stack navigator for the app
const Stack = createNativeStackNavigator();

// Options for the navigation container
const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

export const AppNavigator = () => {
  // Get authentication state and user data from Redux
  const {accessToken, userData} = useSelector(
    (state: RootState) => state.login,
  );

  // Determine initial route name based on authentication state
  const [initialRouteName, setInitialRouteName] = useState('IntroApp');

  // Handle navigation persistence (save/restore navigation state)
  const {initialNavigationState, onNavigationStateChange, isRestored} =
    useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY);

  // Add debugging - log when navigation container is ready
  const handleNavigationReady = () => {
    console.log('Navigation container is ready');
    // Log detailed navigation status
    logNavigationStatus();
  };

  // Determine user role from meData for proper navigation
  const getUserRole = (): string => {
    // Fix: Check if meData and meData.role exist
    if (!userData || !userData.role) return 'AuthNavigator';

    // Fix: Safer access to role with optional chaining
    const role = userData?.role?.toLowerCase() || '';
    console.log('User role:', role);
    switch (role) {
      case 'coach':
      case 'tactical':
        return UserRole.TACTICAL;
      case 'player':
        return UserRole.PLAYER;
      case 'medical':
        return UserRole.MEDICAL;
      case 'management':
        return UserRole.MANAGEMENT;
      default:
        return 'AuthNavigator';
    }
  };

  // Update initial route when auth state changes
  useEffect(() => {
    if (!accessToken) {
      setInitialRouteName('IntroApp');
    } else {
      const role = getUserRole();
      setInitialRouteName(role);
    }
  }, [accessToken, userData]);

  // Don't render until the navigation state is restored
  if (!isRestored) return null;

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={initialNavigationState}
      onStateChange={state => state && onNavigationStateChange(state)}
      onReady={handleNavigationReady} // Add this to debug when ready
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
        }}
        initialRouteName={initialRouteName}>
        <Stack.Screen name="IntroApp" component={IntroApp} />
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        <Stack.Screen
          name={UserRole.TACTICAL}
          getComponent={() =>
            require('./roles/tactical/tactical-navigator').TacticalNavigator
          }
        />
        <Stack.Screen
          name={UserRole.PLAYER}
          getComponent={() =>
            require('./roles/player/player-navigator').PlayerNavigator
          }
        />
        <Stack.Screen
          name={UserRole.MEDICAL}
          getComponent={() =>
            require('./roles/medical/medical-navigator').MedicalNavigator
          }
        />
        <Stack.Screen
          name={UserRole.MANAGEMENT}
          getComponent={() =>
            require('./roles/management/management-navigator')
              .ManagementNavigator
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Add this for back button handling
export const exitRoutes = [
  'TacticalBottomTabs',
  'PlayerBottomTabs',
  'MedicalBottomTabs',
  'ManagementBottomTabs',
];

export const canExit = (routeName: string) => exitRoutes.includes(routeName);
