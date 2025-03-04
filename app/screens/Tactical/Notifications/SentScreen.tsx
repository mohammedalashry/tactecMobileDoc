// screens/Tactical/Notifications/SentScreen.tsx
import React from "react";
import SentNotificationsScreen from "screens/common/notifications/SentNotificationsScreen";

/**
 * Tactical role sent notifications screen
 * Uses the shared sent notifications screen component
 */
const SentScreen = ({ navigation }) => {
  return <SentNotificationsScreen navigation={navigation} />;
};

export default SentScreen;
