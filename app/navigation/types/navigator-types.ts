// types/navigator-types.ts
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {NavigatorParamList} from './route-params';

export type AppNavigationProp<T extends keyof NavigatorParamList> =
  NavigationProp<NavigatorParamList, T>;

export type AppRouteProp<T extends keyof NavigatorParamList> = RouteProp<
  NavigatorParamList,
  T
>;

export type AppScreenProps<T extends keyof NavigatorParamList> = {
  navigation: AppNavigationProp<T>;
  route: AppRouteProp<T>;
};

export enum UserRole {
  TACTICAL = 'tactical',
  PLAYER = 'player',
  MEDICAL = 'medical',
  MANAGEMENT = 'management',
}
