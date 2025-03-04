// screens/common/notifications/NotificationsScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { BaseScreen } from "components/shared/layout/BaseScreen";
import { ReceivedList } from "components/shared/notifications/ReceivedList";
import { color } from "theme";

interface NotificationsScreenProps {
  navigation: any;
}

/**
 * Screen for displaying received notifications
 * Used by all user roles
 */
const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  return (
    <BaseScreen>
      <View style={styles.container}>
        <ReceivedList navigation={navigation} />
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

export default NotificationsScreen;
