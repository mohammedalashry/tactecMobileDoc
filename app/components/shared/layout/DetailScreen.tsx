// components/shared/layout/DetailScreen.tsx
import React from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Header} from '../navigation/Header';
import {BaseScreen} from './BaseScreen';
import {color, padding} from 'theme';

interface DetailScreenProps {
  title?: string;
  loading?: boolean;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  scrollable?: boolean;
  backgroundColor?: string;
}

export const DetailScreen = ({
  title,
  loading = false,
  children,
  headerRight,
  showBackButton = true,
  onBackPress,
  scrollable = true,
  backgroundColor = color.background,
}: DetailScreenProps) => {
  const Content = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      );
    }

    return scrollable ? (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    ) : (
      <View style={styles.contentContainer}>{children}</View>
    );
  };

  return (
    <BaseScreen backgroundColor={backgroundColor}>
      <Header
        title={title}
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        right={headerRight}
      />
      <Content />
    </BaseScreen>
  );
};

// components/shared/layout/DetailScreen.tsx (updated styles)
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: color.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: padding.base,
    backgroundColor: color.background,
  },
});
