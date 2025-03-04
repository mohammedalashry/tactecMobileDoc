// common/factories/create-top-tabs.tsx
import React from 'react';
import {Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {color} from '@theme/color';

export type TopTabConfig = {
  name: string;
  component: React.ComponentType<any>;
  label: string;
  icon?: ({
    color,
    focused,
  }: {
    color: string;
    focused: boolean;
  }) => React.ReactNode;
};

type TopTabsOptions = {
  indicatorWidth?: number;
  showIcons?: boolean;
};

export function createTopTabs(
  tabScreens: TopTabConfig[],
  options: TopTabsOptions = {},
) {
  const Tab = createMaterialTopTabNavigator();

  return () => (
    <Tab.Navigator
      screenOptions={{
        tabBarPressColor: color.primary,
        tabBarContentContainerStyle: {borderBottomColor: color.primary},
        tabBarActiveTintColor: color.primary,
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {
          backgroundColor: color.blackbg,
          borderBottomColor: color.line,
          borderWidth: 1,
        },
        tabBarInactiveTintColor: color.primaryLight,
        tabBarIndicatorStyle: {
          borderBottomColor: color.primary,
          borderWidth: 2,
          width: options.indicatorWidth,
        },
        tabBarIndicatorContainerStyle: {borderBottomColor: color.primary},
      }}>
      {tabScreens.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: focused ? color.text : color.primaryLight,
                  fontWeight: focused ? '700' : 'normal',
                  fontSize: focused ? 13 : 14,
                }}>
                {screen.label}
              </Text>
            ),
            ...(options.showIcons && screen.icon
              ? {
                  tabBarIcon: ({color, focused}) =>
                    screen.icon?.({color, focused}),
                }
              : {}),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
