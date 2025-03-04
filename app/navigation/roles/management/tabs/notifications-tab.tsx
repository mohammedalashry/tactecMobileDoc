// roles/management/tabs/notifications-tab.tsx
import {createStack} from '../../../common/factories/create-stack';
import NotificationScreen from 'screens/Management/Notifications/Screens/NotificationScreens';

// Define screens
const notificationScreens = [
  {
    name: 'NotificationScreen',
    component: NotificationScreen,
  },
];

// Create and export the notifications tab
export const NotificationsTab = createStack(notificationScreens);
