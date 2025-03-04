import React from "react";
import SharedMenuScreen from "screens/common/menu/MenuScreen";

/**
 * Menu screen for tactical staff - delegates to shared implementation
 */
const TacticalMenuScreen = ({ navigation }) => {
  return <SharedMenuScreen navigation={navigation} role="tactical" />;
};

export default TacticalMenuScreen;
