// roles/tactical/tabs/notifications-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {translate} from '@app/i18n';

// Import screens from existing paths
import {
  RecievedScreen,
  SentScreen,
} from 'screens/Tactical/Notifications/NotificationScreens';
import {TabIcons} from 'navigation/common/icons/tab-icons';

// Define the top tabs configuration
const notificationsTabScreens = [
  {
    name: 'RecievedScreen',
    component: RecievedScreen,
    label: translate('tabs.Recived'),
    icon: ({color}) => TabIcons.received({color}),
  },
  {
    name: 'SentScreen',
    component: SentScreen,
    label: translate('tabs.Sent'),
    icon: ({color}) => TabIcons.sent({color}),
  },
];

// Create and export the notifications tab navigator
export const NotificationsTab = createTopTabs(notificationsTabScreens, {
  showIcons: true,
});
