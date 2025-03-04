// roles/tactical/tabs/menu-tab.tsx
import {createStack} from '../../../common/factories/create-stack';

// Import screens from existing paths
import {MenuScreen, MeScreen} from 'screens/Tactical/Menu/MenuScreens';

// Define the screens for the Menu stack
const menuScreens = [
  {
    name: 'MenuScreen',
    component: MenuScreen,
  },
  {
    name: 'MeScreen',
    component: MeScreen,
  },
];

// Create and export the Menu navigator
export const MenuTab = createStack(menuScreens, {
  initialRouteName: 'MenuScreen',
});
