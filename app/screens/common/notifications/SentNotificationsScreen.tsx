// screens/common/notifications/SentNotificationsScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { BaseScreen } from "components/shared/layout/BaseScreen";
import { SentList } from "components/shared/notifications/SentList";
import { color } from "theme";

interface SentNotificationsScreenProps {
  navigation: any;
}

/**
 * Screen for displaying sent notifications
 * Used by all user roles
 */
const SentNotificationsScreen: React.FC<SentNotificationsScreenProps> = ({
  navigation,
}) => {
  return (
    <BaseScreen>
      <View style={styles.container}>
        <SentList navigation={navigation} />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
});

export default SentNotificationsScreen;
