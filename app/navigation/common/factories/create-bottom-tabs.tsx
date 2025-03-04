// common/factories/create-bottom-tabs.tsx
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {color} from '@theme/color';

export type BottomTabConfig = {
  name: string;
  component: React.ComponentType<any>;
  label: string;
  icon: ({
    color,
    focused,
  }: {
    color: string;
    focused: boolean;
  }) => React.ReactNode;
  headerComponent?: React.ReactNode;
};

export function createBottomTabs(tabScreens: BottomTabConfig[]) {
  const Tab = createBottomTabNavigator();

  return () => (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: color.primary,
        tabBarLabelStyle: {fontSize: 12, color: color.text},
        tabBarStyle: {
          backgroundColor: color.blackbg,
          height: 80,
          paddingBottom: 10,
        },
        tabBarInactiveTintColor: color.text,
        tabBarHideOnKeyboard: true,
      }}>
      {tabScreens.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarLabel: screen.label,
            tabBarIcon: ({color, focused}) => screen.icon({color, focused}),
            header: () =>
              screen.headerComponent || (
                <View style={styles.defaultHeader}>
                  <Image
                    source={require('../../../../assets/images/Screenshot1.png')}
                  />
                </View>
              ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  defaultHeader: {
    backgroundColor: color.blackbg,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
});
