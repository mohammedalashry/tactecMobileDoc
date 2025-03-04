// roles/management/tabs/players-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {TabIcons} from '../../../common/icons/tab-icons';
import {translate} from '@app/i18n';

// Import screens
import {ProfilesScreen} from 'screens/Management/Players/PlayersScreens';
import {AttendanceScreen} from 'screens/Management/Players/PlayersScreens';
import ComplaintsScreen from 'screens/Management/Players/Screens/Complaints/Complaints';

// Define tab screens
const playersTabScreens = [
  {
    name: 'ProfilesScreen',
    component: ProfilesScreen,
    label: translate('tabs.Profiles'),
    icon: ({color}) => TabIcons.profile({color}),
  },
  {
    name: 'AttendanceScreen',
    component: AttendanceScreen,
    label: translate('tabs.Attendance'),
    icon: ({color}) => TabIcons.attendance({color}),
  },
  {
    name: 'ComplaintsScreen',
    component: ComplaintsScreen,
    label: translate('tabs.Complaints'),
    icon: ({color}) => TabIcons.complaints({color}),
  },
];

// Create and export the players tab
export const PlayersTab = createTopTabs(playersTabScreens, {
  showIcons: true,
});
