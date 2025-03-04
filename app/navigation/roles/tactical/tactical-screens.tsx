// roles/tactical/tactical-screens.tsx
import {createStack} from '../../common/factories/create-stack';

// Import all detail screens used in tactical role
import MatchScreen from 'screens/Tactical/Home/Screens/Matches/MatchScreen';
import TaskScreen from 'screens/Tactical/Home/Screens/Tasks/TaskDetailsScreen';
import AssignTaskScreen from 'screens/Tactical/Home/Screens/Tasks/components/AssignTaskScreen';
import TrainingScreen from 'screens/Tactical/Home/Screens/Traning/TrainingDetailsScreen';
import AssignTrainingScreen from 'screens/Tactical/Home/Screens/Traning/components/AssignTrainingScreen';
import ProfileScreen from 'screens/Tactical/Players/Screens/Profiles/ProfileDetailsScreen';
import AttendanceProfile from 'screens/Tactical/Players/Screens/Attendance/AttendanceProfile';
import AssignNotificationScreen from 'screens/Tactical/Notifications/Screens/components/AssignNotification';

// Define all detail screens
const tacticalDetailScreens = [
  {name: 'MatchScreen', component: MatchScreen},
  {name: 'TaskScreen', component: TaskScreen},
  {name: 'AssignTaskScreen', component: AssignTaskScreen},
  {name: 'TrainingScreen', component: TrainingScreen},
  {name: 'AssignTrainingScreen', component: AssignTrainingScreen},
  {name: 'ProfileScreen', component: ProfileScreen},
  {name: 'AttendanceProfile', component: AttendanceProfile},
  {name: 'AssignNotificationScreen', component: AssignNotificationScreen},
];

// Create and export the tactical detail screens navigator
export const TacticalScreensNavigator = createStack(tacticalDetailScreens);
