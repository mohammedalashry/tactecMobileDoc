// roles/medical/tabs/notifications-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {translate} from '@app/i18n';
import {TabIcons} from 'navigation/common/icons/tab-icons';

// Import screens
import {
  RecievedScreen,
  SentScreen,
} from 'screens/Medical/Notifications/NotificationScreens';

// Define tab screens
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

// Create and export the notifications tab
export const NotificationsTab = createTopTabs(notificationsTabScreens, {
  showIcons: true,
});
