import {ViewStyle, TextStyle} from 'react-native';
import {color, spacing} from '../../theme';

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[2],
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 48,
};

const TEXT_VIEW: ViewStyle = {};

const BASE_TEXT: TextStyle = {
  paddingHorizontal: spacing[3],
};

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets: Record<string, ViewStyle> = {
  /**
   * A smaller piece of secondard information.
   */
  primary: {...BASE_VIEW, backgroundColor: color.primary} as ViewStyle,

  text: {...TEXT_VIEW} as ViewStyle,

  outline: {...BASE_VIEW, borderColor: color.primary, borderWidth: 0.5},

  disabled: {...BASE_VIEW, backgroundColor: `${color.primary}50`} as ViewStyle,

  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'flex-start',
  } as ViewStyle,
};

export const textPresets: Record<ButtonPresetNames, TextStyle> = {
  primary: {
    ...BASE_TEXT,
    fontSize: 12,
    color: color.palette.white,
  } as TextStyle,

  text: {color: color.palette.black, fontSize: 12} as TextStyle,

  outline: {color: color.palette.black, fontSize: 12} as TextStyle,

  link: {
    ...BASE_TEXT,
    color: color.text,
    paddingHorizontal: 0,
    paddingVertical: 0,
  } as TextStyle,
};

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets;
