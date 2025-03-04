// roles/tactical/tabs/home-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {TabIcons} from '../../../common/icons/tab-icons';
import {translate} from '@app/i18n';

// Import the screens from existing paths
import {
  MatchesScreen,
  TrainingsScreen,
  TasksScreen,
  ReportsScreen,
} from 'screens/Tactical/Home/HomeScreens';

// Define the top tabs configuration
const homeTabScreens = [
  {
    name: 'MatchesScreen',
    component: MatchesScreen,
    label: translate('tabs.Matches'),
    icon: ({color}) => TabIcons.matches({color}),
  },
  {
    name: 'TraningScreen',
    component: TrainingsScreen,
    label: translate('tabs.Training'),
    icon: ({color}) => TabIcons.training({color}),
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

// Create and export the home tab navigator
export const HomeTab = createTopTabs(homeTabScreens, {
  indicatorWidth: 100,
  showIcons: true,
});
