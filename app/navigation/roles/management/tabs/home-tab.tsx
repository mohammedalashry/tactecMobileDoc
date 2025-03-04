// roles/management/tabs/home-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {TabIcons} from '../../../common/icons/tab-icons';
import {translate} from '@app/i18n';

// Import screens
import MatchesScreen from 'screens/Management/Home/Screens/Matches/MatchesScreen';
import TasksScreen from 'screens/Management/Home/Screens/Tasks/TasksScreen';
import TrainingsScreen from 'screens/Management/Home/Screens/Traning/TrainingsScreen';

// Define tab screens
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
];

// Create and export the home tab
export const HomeTab = createTopTabs(homeTabScreens, {
  indicatorWidth: 100,
  showIcons: true,
});
