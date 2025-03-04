// common/components/header.tsx
import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {color} from '@theme/color';

type HeaderProps = {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  customRight?: React.ReactNode;
};

export const Header = ({
  title,
  showBackButton = false,
  showLogo = true,
  customRight,
}: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={color.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        {showLogo && (
          <Image
            source={require('../../../../assets/images/Screenshot1.png')}
            style={styles.logo}
          />
        )}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightContainer}>{customRight}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.blackbg,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
  logo: {
    resizeMode: 'contain',
    height: 40,
  },
  title: {
    color: color.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
