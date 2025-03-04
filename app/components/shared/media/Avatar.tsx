import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {color} from '@theme/color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface AvatarProps {
  uri?: string;
  size?: number;
  placeholder?: 'user' | 'person' | 'account';
  style?: object;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Reusable avatar component that shows an image if available,
 * or a placeholder icon if no image
 */
export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 50,
  placeholder = 'user',
  style,
  backgroundColor = color.cardbg,
  borderColor = color.line,
  borderWidth = 1,
}) => {
  const getPlaceholderIcon = () => {
    switch (placeholder) {
      case 'user':
        return <FontAwesome name="user" size={size * 0.6} color={color.text} />;
      case 'person':
        return (
          <MaterialIcons name="person" size={size * 0.7} color={color.text} />
        );
      case 'account':
        return (
          <MaterialIcons
            name="account-circle"
            size={size * 0.8}
            color={color.text}
          />
        );
      default:
        return <FontAwesome name="user" size={size * 0.6} color={color.text} />;
    }
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
    borderColor,
    borderWidth,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {uri ? (
        <Image source={{uri}} style={styles.image} resizeMode="cover" />
      ) : (
        getPlaceholderIcon()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
