// components/shared/layout/BaseScreen.tsx
import React from 'react';
import {View, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {color} from 'theme';

interface BaseScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  safeArea?: boolean;
  padding?: number;
}

export const BaseScreen = ({
  children,
  backgroundColor = color.background,
  statusBarColor = color.blackbg,
  statusBarStyle = 'light-content',
  safeArea = true,
  padding = 0,
}: BaseScreenProps) => {
  const Content = () => (
    <View style={[styles.container, {backgroundColor, padding}]}>
      {children}
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
      {safeArea ? (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
          <Content />
        </SafeAreaView>
      ) : (
        <Content />
      )}
    </>
  );
};

// components/shared/layout/BaseScreen.tsx (updated styles)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
