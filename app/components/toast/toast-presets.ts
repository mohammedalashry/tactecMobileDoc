import {color} from '@theme/color';
import {ViewStyle} from 'react-native';

export const presets = {
  default: {
    backgroundColor: color.palette.green,
  } as ViewStyle,

  error: {
    backgroundColor: color.palette.angry,
  } as ViewStyle,
};

export type ToastPresets = keyof typeof presets;
