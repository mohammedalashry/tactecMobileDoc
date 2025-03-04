// roles/player/tabs/check-in-tab.tsx
import {createStack} from '../../../common/factories/create-stack';
import CheckInScreen from 'screens/Player/CheckIn/CheckInScreen';

// Define screens
const checkInScreens = [
  {
    name: 'CheckInScreen',
    component: CheckInScreen,
  },
];

// Create and export the check-in tab
export const CheckInTab = createStack(checkInScreens);
