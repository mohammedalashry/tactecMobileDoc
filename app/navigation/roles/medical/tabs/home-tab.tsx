// roles/medical/tabs/home-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {TabIcons} from '../../../common/icons/tab-icons';
import {translate} from '@app/i18n';

// Import screens
import MatchesScreen from 'screens/Medical/Home/Screens/Matches/MatchesScreen';
import {TasksScreen, ReportsScreen} from 'screens/Medical/Home/HomeScreen';

// Define tab screens
const homeTabScreens = [
  {
    name: 'MatchesScreen',
    component: MatchesScreen,
    label: translate('tabs.Matches'),
    icon: ({color}) => TabIcons.matches({color}),
  },
  {
    name: 'TasksScreen',
    component: TasksScreen,
    label: translate('tabs.Tasks'),
    icon: ({color}) => TabIcons.tasks({color}),
  },
  {
    name: 'ReportsScreen',
    component: ReportsScreen,
    label: translate('tabs.Reports'),
    icon: ({color}) => TabIcons.reports({color}),
  },
];

// Create and export the home tab
export const HomeTab = createTopTabs(homeTabScreens, {
  indicatorWidth: 100,
  showIcons: true,
});
