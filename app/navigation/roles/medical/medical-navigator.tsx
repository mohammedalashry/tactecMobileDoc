// roles/medical/medical-navigator.tsx
import {createStack} from '../../common/factories/create-stack';
import {MedicalBottomTabNavigator} from './medical-bottom-tabs';

// Import detail screens
import MedicalMatchScreen from 'screens/Medical/Home/Screens/Matches/MatchScreen';
import MedicalTaskScreen from 'screens/Medical/Home/Screens/Tasks/TaskDetailsScreen';
import MedicalAssignTaskScreen from 'screens/Medical/Home/Screens/Tasks/AssignTaskScreen';
import MedicalProfileScreen from 'screens/Medical/Players/Screens/Profiles/ProfileDetailsScreen';
import NewTask from 'screens/Medical/Home/Screens/Tasks/NewTask';
import {MedicalReply} from 'screens/Medical/Medical/screens/Reply';
import MedicalGoogleForms from 'screens/Medical/Medical/screens/GoogleForms';
import MedicalPlayerProfile from 'screens/Medical/Medical/screens/MedicalPlayerProfile';
import MorningCheck from 'screens/Medical/Medical/screens/MorningCheck';
import EveningCheck from 'screens/Medical/Medical/screens/EveningCheck';
import MorningCheckScreen from 'screens/Medical/Medical/screens/MorningCheckScreen';
import EveningCheckScreen from 'screens/Medical/Medical/screens/EveningCheckScreen';

// Define screens
const medicalNavigatorScreens = [
  {
    name: 'MedicalBottomTabs',
    component: MedicalBottomTabNavigator,
  },
  // Detail screens
  {name: 'MedicalMatchScreen', component: MedicalMatchScreen},
  {name: 'MedicalTaskScreen', component: MedicalTaskScreen},
  {name: 'MedicalAssignTaskScreen', component: MedicalAssignTaskScreen},
  {name: 'MedicalProfileScreen', component: MedicalProfileScreen},
  {name: 'NewTask', component: NewTask},
  {name: 'MedicalReply', component: MedicalReply},
  {name: 'MedicalGoogleForms', component: MedicalGoogleForms},
  {name: 'MedicalPlayerProfile', component: MedicalPlayerProfile},
  {name: 'MedicalMorningCheck', component: MorningCheck},
  {name: 'MedicalEveningCheck', component: EveningCheck},
  {name: 'MorningCheckScreen', component: MorningCheckScreen},
  {name: 'EveningCheckScreen', component: EveningCheckScreen},
];

// Create and export medical navigator
export const MedicalNavigator = createStack(medicalNavigatorScreens, {
  initialRouteName: 'MedicalBottomTabs',
});
