// roles/tactical/tabs/tactec-tab.tsx
import {createStack} from '../../../common/factories/create-stack';

// Import screens from existing paths
import NewProjectScreen from 'screens/Tactical/Tactec/NewprojectScreen';
import TacticalPad from 'screens/Tactical/Tactec/TacticalPad';
//import TactecAssignTaskScreen from 'screens/Tactical/Tactec/Screens/TactecTasks/AssignTaskScreen';
import TectacTaskScreen from 'screens/Tactical/Tactec/Screens/TactecTasks/TaskScreen';
import TactecAssignTrainingScreen from 'screens/Tactical/Tactec/Screens/TactecTraning/AssignTrainingScreen';
import TectacTrainingScreen from 'screens/Tactical/Tactec/Screens/TactecTraning/TrainingScreen';

// Define the screens for the TacTec stack
const tactecScreens = [
  {
    name: 'NewProjectScreen',
    component: NewProjectScreen,
  },
  {
    name: 'TacticalPad',
    component: TacticalPad,
    options: {
      orientation: 'landscape_left',
      presentation: 'fullScreenModal',
    },
  },
  // {
  //   name: 'TactecAssignTaskScreen',
  //   component: TactecAssignTaskScreen,
  // },
  {
    name: 'TectacTaskScreen',
    component: TectacTaskScreen,
  },
  {
    name: 'TactecAssignTrainingScreen',
    component: TactecAssignTrainingScreen,
  },
  {
    name: 'TectacTrainingScreen',
    component: TectacTrainingScreen,
  },
];

// Create and export the TacTec navigator
export const TactecTab = createStack(tactecScreens, {
  initialRouteName: 'NewProjectScreen',
});
