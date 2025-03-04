// roles/tactical/tactical-bottom-tabs.tsx
import React from 'react';
import {createBottomTabs} from '../../common/factories/create-bottom-tabs';
import {TabIcons} from '../../common/icons/tab-icons';
import {translate} from '@app/i18n';
import {Header} from '../../common/components/header';

// Import the tab navigators
import {HomeTab} from './tabs/home-tab';
import {PlayersTab} from './tabs/players-tab';
import {TactecTab} from './tabs/tactec-tab';
import {NotificationsTab} from './tabs/notifications-tab';
import {MenuTab} from './tabs/menu-tab';

// Define the tab configuration
const tabScreens = [
  {
    name: 'Home',
    component: HomeTab,
    label: translate('tabs.Home'),
    icon: ({color}) => TabIcons.home({color}),
    headerComponent: <Header showLogo={true} />,
  },
  {
    name: 'Players',
    component: PlayersTab,
    label: translate('tabs.Players'),
    icon: ({color}) => TabIcons.players({color}),
    headerComponent: <Header showLogo={true} />,
  },
  {
    name: 'TactecTab',
    component: TactecTab,
    label: translate('tabs.TacTec'),
    icon: ({color, focused}) => TabIcons.tacticalCenter({color, focused}),
    headerComponent: <Header showLogo={true} />,
  },
  {
    name: 'Notification',
    component: NotificationsTab,
    label: translate('tabs.Notification'),
    icon: ({color}) => TabIcons.notification({color}),
    headerComponent: <Header showLogo={true} />,
  },
  {
    name: 'MenuScreen',
    component: MenuTab,
    label: translate('tabs.Menu'),
    icon: ({color}) => TabIcons.menu({color}),
    headerComponent: <Header showLogo={true} />,
  },
];

// Create and export the bottom tab navigator
export const TacticalBottomTabNavigator = createBottomTabs(tabScreens);
