// roles/tactical/tabs/players-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {TabIcons} from '../../../common/icons/tab-icons';
import {translate} from '@app/i18n';

// Import the screens from existing paths
import {
  ProfilesScreen,
  AttendanceScreen,
} from 'screens/Tactical/Players/PlayersScreens';

// Define the top tabs configuration
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
];

// Create and export the players tab navigator
export const PlayersTab = createTopTabs(playersTabScreens, {
  showIcons: true,
});
