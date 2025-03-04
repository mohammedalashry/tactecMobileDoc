// Update the roles/tactical/tactical-navigator.tsx
import {createStack} from '../../common/factories/create-stack';
import {TacticalBottomTabNavigator} from './tactical-bottom-tabs';
import {TacticalScreensNavigator} from './tactical-screens';

// Combine the bottom tabs with the detail screens in a stack
const tacticalNavigatorScreens = [
  {
    name: 'TacticalBottomTabs',
    component: TacticalBottomTabNavigator,
  },
  {
    name: 'TacticalScreens',
    component: TacticalScreensNavigator,
  },
];

// Create and export the tactical navigator
export const TacticalNavigator = createStack(tacticalNavigatorScreens, {
  initialRouteName: 'TacticalBottomTabs',
});
