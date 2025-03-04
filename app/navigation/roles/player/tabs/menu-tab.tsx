// roles/player/tabs/menu-tab.tsx
import {createStack} from '../../../common/factories/create-stack';
import {MenuScreen} from 'screens/Player/Menu/MenuScreens';
import PlayerMeScreen from 'screens/Player/Menu/Screens/MeScreen/MeScreen';

// Define screens
const menuScreens = [
  {
    name: 'MenuScreen',
    component: MenuScreen,
  },
  {
    name: 'PlayerMeScreen',
    component: PlayerMeScreen,
  },
];

// Create and export the menu tab
export const MenuTab = createStack(menuScreens, {
  initialRouteName: 'MenuScreen',
});
