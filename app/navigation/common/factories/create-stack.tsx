// common/factories/create-stack.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type StackScreenConfig = {
  name: string;
  component: React.ComponentType<any>;
  options?: any;
};

type StackOptions = {
  initialRouteName?: string;
  screenOptions?: any;
};

export function createStack(
  screens: StackScreenConfig[],
  options: StackOptions = {},
) {
  const Stack = createNativeStackNavigator();

  return () => (
    <Stack.Navigator
      initialRouteName={options.initialRouteName || screens[0]?.name}
      screenOptions={{
        headerShown: false,
        ...options.screenOptions,
      }}>
      {screens.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options || {}}
        />
      ))}
    </Stack.Navigator>
  );
}
