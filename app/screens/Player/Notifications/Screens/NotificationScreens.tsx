// screens/Tactical/Notifications/RecievedScreen.tsx
import React from "react";
import NotificationsScreen from "screens/common/notifications/NotificationsScreen";

/**
 * Tactical role received notifications screen
 * Uses the shared notifications screen component
 */
const RecievedScreen = ({ navigation }) => {
  return <NotificationsScreen navigation={navigation} />;
};

export default RecievedScreen;
