// roles/medical/tabs/menu-tab.tsx
import {createStack} from '../../../common/factories/create-stack';
import {MenuScreen} from 'screens/Medical/Menu/MenuScreens';
import MedicalMeScreen from 'screens/Medical/Menu/Screens/MeScreen/MeScreen';

// Define screens
const menuScreens = [
  {
    name: 'MenuScreen',
    component: MenuScreen,
  },
  {
    name: 'MedicalMeScreen',
    component: MedicalMeScreen,
  },
];

// Create and export the menu tab
export const MenuTab = createStack(menuScreens, {
  initialRouteName: 'MenuScreen',
});
