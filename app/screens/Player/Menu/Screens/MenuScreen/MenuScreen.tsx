import React from "react";
import SharedMenuScreen from "screens/common/menu/MenuScreen";

/**
 * Menu screen for players - delegates to shared implementation
 */
const PlayerMenuScreen = ({ navigation }) => {
  return <SharedMenuScreen navigation={navigation} role="player" />;
};

export default PlayerMenuScreen;
