// components/shared/layout/RTLWrapper.tsx
import React from 'react';
import {View, ViewStyle, StyleProp, TextStyle} from 'react-native';
import {useLanguage} from 'hooks/language/useLanguage';

interface RTLWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  reversed?: boolean; // force reverse the normal direction
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
}

/**
 * Wrapper component that automatically handles RTL layout
 */
export const RTLWrapper: React.FC<RTLWrapperProps> = ({
  children,
  style,
  containerStyle,
  reversed = false,
  flexDirection = 'row',
}) => {
  const {isRTL} = useLanguage();

  // Determine the correct flex direction
  let direction = flexDirection;
  if (flexDirection === 'row' || flexDirection === 'row-reverse') {
    // Only modify row directions for RTL
    const isRowReverse = flexDirection === 'row-reverse';

    if (isRTL) {
      // For RTL, flip the directions
      direction = reversed
        ? isRowReverse
          ? 'row'
          : 'row-reverse'
        : isRowReverse
        ? 'row-reverse'
        : 'row-reverse';
    } else {
      // For LTR, use normal logic
      direction = reversed
        ? isRowReverse
          ? 'row-reverse'
          : 'row'
        : flexDirection;
    }
  }

  return (
    <View style={[{flexDirection: direction}, style, containerStyle]}>
      {children}
    </View>
  );
};

// Custom hook to get RTL text style
export const useRTLTextStyle = () => {
  const {isRTL} = useLanguage();

  // Function to apply RTL-aware text styling
  const getRTLTextStyle = (
    customStyle: StyleProp<TextStyle> = {},
  ): StyleProp<TextStyle> => {
    const baseStyle: TextStyle = {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    };

    // Merge with custom style
    return [baseStyle, customStyle];
  };

  return getRTLTextStyle;
};

/**
 * Creates a text style object with appropriate text alignment based on RTL setting
 * @deprecated Use useRTLTextStyle hook instead
 */
export const rtlTextStyle = (
  customStyle: StyleProp<TextStyle> = {},
): StyleProp<TextStyle> => {
  // This implementation would cause runtime issues since hooks can't be called in regular functions
  // It's kept here for backward compatibility but marked as deprecated
  console.warn('rtlTextStyle is deprecated. Use useRTLTextStyle hook instead.');

  // Return a static style instead of a dynamic one
  return [
    {
      textAlign: 'auto',
      writingDirection: 'auto',
    },
    customStyle,
  ];
};
