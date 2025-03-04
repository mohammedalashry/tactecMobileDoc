// roles/management/tabs/menu-tab.tsx
import {createStack} from '../../../common/factories/create-stack';
import {MenuScreen} from 'screens/Management/Menu/MenuScreens';

// Define screens
const menuScreens = [
  {
    name: 'MenuScreen',
    component: MenuScreen,
  },
];

// Create and export the menu tab
export const MenuTab = createStack(menuScreens, {
  initialRouteName: 'MenuScreen',
});
