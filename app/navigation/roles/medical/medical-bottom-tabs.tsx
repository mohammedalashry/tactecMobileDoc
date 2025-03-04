// roles/medical/medical-bottom-tabs.tsx
import React from 'react';
import {createBottomTabs} from '../../common/factories/create-bottom-tabs';
import {TabIcons} from '../../common/icons/tab-icons';
import {translate} from '@app/i18n';
import {Header} from '../../common/components/header';

// Import tabs
import {HomeTab} from './tabs/home-tab';
import {PlayersTab} from './tabs/players-tab';
import {MedicalTab} from './tabs/medical-tab';
import {NotificationsTab} from './tabs/notifications-tab';
import {MenuTab} from './tabs/menu-tab';

// Create the medical tabs configuration
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
    name: 'TopTabMedical',
    component: MedicalTab,
    label: translate('tabs.Medical'),
    icon: ({color, focused}) => TabIcons.medicalCenter({color, focused}),
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

// Create and export medical bottom tabs
export const MedicalBottomTabNavigator = createBottomTabs(tabScreens);
