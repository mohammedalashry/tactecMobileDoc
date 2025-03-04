// types/route-params.ts
import {UserRole} from './navigator-types';
export type CommonRouteParams = {
  IntroApp: undefined;
  AuthNavigator: undefined;
  [UserRole.TACTICAL]: undefined;
  [UserRole.PLAYER]: undefined;
  [UserRole.MEDICAL]: undefined;
  [UserRole.MANAGEMENT]: undefined;
};
export type AuthRouteParams = {
  LoginScreen: {
    activeAccount?: boolean;
    email?: string;
    token?: string;
    userLoggedIn?: boolean;
    onClose?: () => void;
  };
  SignUpScreen: undefined;
  CompletePlayerRegister: {values?: any; dateOfBirth?: string; value?: string};
  ResetPasswordScreen: undefined;
  ForgetPasswordScreen: undefined;
};

export type TacticalRouteParams = {
  HomeTabs: undefined;
  MatchScreen: undefined;
  TaskScreen: undefined;
  AssignTaskScreen: undefined;
  TrainingScreen: undefined;
  AssignTrainingScreen: undefined;
  ProfileScreen: undefined;
  AttendanceProfile: undefined;
  TacTecBoardScreen: undefined;
  TactecAssignTaskScreen: undefined;
  TectacTaskScreen: undefined;
  TactecAssignTrainingScreen: undefined;
  TectacTrainingScreen: undefined;
  AssignNotificationScreen: undefined;
  MeScreen: undefined;
};
export type PlayerRouteParams = {
  PlayerBottomTabs: undefined;
  PlayerTaskScreen: undefined;
  PlayerMatchScreen: undefined;
  PlayerTrainingScreen: undefined;
  CheckInSCan: undefined;
  ResultSCan: undefined;
  GoogleForms: undefined;
  MedicalComplaintsReply: undefined;
  PlayerMeScreen: undefined;
};

export type MedicalRouteParams = {
  MedicalBottomTabs: undefined;
  MedicalMatchScreen: undefined;
  MedicalTaskScreen: undefined;
  MedicalAssignTaskScreen: undefined;
  MedicalProfileScreen: undefined;
  NewTask: undefined;
  MedicalReply: undefined;
  MedicalGoogleForms: undefined;
  MedicalPlayerProfile: undefined;
  MedicalMorningCheck: undefined;
  MedicalEveningCheck: undefined;
  MorningCheckScreen: undefined;
  EveningCheckScreen: undefined;
  MedicalMeScreen: undefined;
};

// types/route-params.ts (add this section)
export type ManagementRouteParams = {
  ManagementBottomTabs: undefined;
  ManagementMeScreen: undefined;
  ManagementMatchScreen: undefined;
  ManagementTaskScreen: undefined;
  ManagementTrainingScreen: undefined;
  ManagementAttendanceProfile: undefined;
  ManagementProfileScreen: undefined;
  Reply: undefined;
};

// Update NavigatorParamList to include ManagementRouteParams
export type NavigatorParamList = CommonRouteParams &
  AuthRouteParams &
  TacticalRouteParams &
  PlayerRouteParams &
  MedicalRouteParams &
  ManagementRouteParams;
