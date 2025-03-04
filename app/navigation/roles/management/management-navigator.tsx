// roles/management/management-navigator.tsx
import {createStack} from '../../common/factories/create-stack';
import {ManagementBottomTabNavigator} from './management-bottom-tabs';

// Import detail screens
import ManagementMeScreen from 'screens/Management/Menu/Screens/MeScreen/MeScreen';
import ManagementMatchScreen from 'screens/Management/Home/Screens/Matches/MatchScreen';
import ManagementTaskScreen from 'screens/Management/Home/Screens/Tasks/TaskDetailsScreen';
import ManagementTrainingDetailsScreen from 'screens/Management/Home/Screens/Traning/TrainingDetailsScreen';
import ManagementAttendanceProfile from 'screens/Management/Players/Screens/Attendance/AttendanceProfile';
import ManagementProfileScreen from 'screens/Management/Players/Screens/Profiles/ProfileDetailsScreen';
import Reply from 'screens/Management/Players/Screens/Complaints/Reply';

// Define screens
const managementNavigatorScreens = [
  {
    name: 'ManagementBottomTabs',
    component: ManagementBottomTabNavigator,
  },
  // Detail screens
  {name: 'ManagementMeScreen', component: ManagementMeScreen},
  {name: 'ManagementMatchScreen', component: ManagementMatchScreen},
  {name: 'ManagementTaskScreen', component: ManagementTaskScreen},
  {
    name: 'ManagementTrainingScreen',
    component: ManagementTrainingDetailsScreen,
  },
  {name: 'ManagementAttendanceProfile', component: ManagementAttendanceProfile},
  {name: 'ManagementProfileScreen', component: ManagementProfileScreen},
  {name: 'Reply', component: Reply},
];

// Create and export management navigator
export const ManagementNavigator = createStack(managementNavigatorScreens, {
  initialRouteName: 'ManagementBottomTabs',
});
