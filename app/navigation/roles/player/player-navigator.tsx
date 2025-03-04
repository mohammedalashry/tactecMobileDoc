// roles/player/player-navigator.tsx
import { createStack } from "../../common/factories/create-stack";
import { PlayerBottomTabNavigator } from "./player-bottom-tabs";

// Import player detail screens
import PlayerTaskScreen from "screens/Player/Home/Screens/Tasks/TaskDetailsScreen";
import PlayerMatchScreen from "screens/Player/Home/Screens/Matches/MatchScreen";
import PlayerTrainingDetailsScreen from "screens/Player/Home/Screens/Traning/TrainingDetailsScreen";
import CheckInSCan from "screens/Player/CheckIn/CheckInScan";
import ResultSCan from "screens/Player/CheckIn/ResultScan";
import MedicalComplaintsReply from "screens/Player/Profile/Screens/MedicalComplaintsReply";

// Define the player navigator screens
const playerNavigatorScreens = [
  {
    name: "PlayerBottomTabs",
    component: PlayerBottomTabNavigator,
  },
  // Detail screens
  { name: "PlayerTaskScreen", component: PlayerTaskScreen },
  { name: "PlayerMatchScreen", component: PlayerMatchScreen },
  { name: "PlayerTrainingScreen", component: PlayerTrainingDetailsScreen },
  { name: "CheckInSCan", component: CheckInSCan },
  { name: "ResultSCan", component: ResultSCan },
  { name: "MedicalComplaintsReply", component: MedicalComplaintsReply },
];

// Create and export the player navigator
export const PlayerNavigator = createStack(playerNavigatorScreens, {
  initialRouteName: "PlayerBottomTabs",
});
