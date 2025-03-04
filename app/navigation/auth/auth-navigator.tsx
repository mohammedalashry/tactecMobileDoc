// auth/auth-navigator.tsx
import {createStack} from '../common/factories/create-stack';

// Import screens from the existing file paths
import {
  ForgetPasswordScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
} from 'screens/Auth/AuthScreens';
import CompletePlayerRegister from 'screens/Auth/Register/CompletePlayerRegister';

// Define the screens for the auth stack
const authScreens = [
  {
    name: 'LoginScreen',
    component: LoginScreen,
  },
  {
    name: 'SignUpScreen',
    component: RegisterScreen,
  },
  {
    name: 'CompletePlayerRegister',
    component: CompletePlayerRegister,
  },
  {
    name: 'ForgetPasswordScreen',
    component: ForgetPasswordScreen,
  },
  {
    name: 'ResetPasswordScreen',
    component: ResetPasswordScreen,
  },
];

// Create and export the auth navigator
export const AuthNavigator = createStack(authScreens, {
  initialRouteName: 'LoginScreen',
  screenOptions: {
    headerShown: false,
    // Optional animation settings for transitions
    animation: 'slide_from_right',
  },
});
