// roles/player/player-bottom-tabs.tsx
import React from 'react';
import {createBottomTabs} from '../../common/factories/create-bottom-tabs';
import {TabIcons} from '../../common/icons/tab-icons';
import {translate} from '@app/i18n';
import {Header} from '../../common/components/header';

// Import tabs
import {HomeTab} from './tabs/home-tab';
import {CheckInTab} from './tabs/check-in-tab';
import {ProfileTab} from './tabs/profile-tab';
import {NotificationsTab} from './tabs/notifications-tab';
import {MenuTab} from './tabs/menu-tab';

// Create the player tabs configuration
const tabScreens = [
  {
    name: 'Home',
    component: HomeTab,
    label: translate('tabs.Home'),
    icon: ({color}) => TabIcons.home({color}),
    headerComponent: <Header showLogo={true} />,
  },
  {
    name: 'CheckInTab',
    component: CheckInTab,
    label: translate('tabs.CheckIn'),
    icon: ({color}) => TabIcons.checkIn({color}),
    headerComponent: <Header title="Scan QR Code" showLogo={false} />,
  },
  {
    name: 'ProfileTab',
    component: ProfileTab,
    label: translate('tabs.Profile'),
    icon: ({color, focused}) => TabIcons.playerCenter({color, focused}),
    headerComponent: <Header title="Profile" showLogo={false} />,
  },
  {
    name: 'NotificationsTab',
    component: NotificationsTab,
    label: translate('tabs.Notification'),
    icon: ({color}) => TabIcons.notification({color}),
    headerComponent: <Header showLogo={true} />,
  },
  {
    name: 'MenuTab',
    component: MenuTab,
    label: translate('tabs.Menu'),
    icon: ({color}) => TabIcons.menu({color}),
    headerComponent: <Header showLogo={true} />,
  },
];

// Create and export the bottom tabs
export const PlayerBottomTabNavigator = createBottomTabs(tabScreens);
